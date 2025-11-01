import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from './realConfig';

// Collections
export const COLLECTIONS = {
  USERS: 'users',
  PROFESSIONALS: 'professionals',
  APPOINTMENTS: 'appointments',
  REVIEWS: 'reviews',
  NOTIFICATIONS: 'notifications',
  FRIENDS: 'friendRelationships', // Matches existing Firestore collection
  FRIEND_REQUESTS: 'friendRequests',
  PROFESSIONAL_RECOMMENDATIONS: 'professionalRecommendations', // Matches existing Firestore collection
  CATEGORIES: 'categories', // Professions/Categories
  CITIES: 'cities', // Cities
} as const;

// User operations
export const createUser = async (userData: any) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.USERS), {
      ...userData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUser = async (userId: string) => {
  try {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const q = query(collection(db, COLLECTIONS.USERS), where('email', '==', email), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

// Professional operations
export const createProfessional = async (professionalData: any) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.PROFESSIONALS), {
      ...professionalData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating professional:', error);
    throw error;
  }
};

export const getProfessionals = async (filters?: any) => {
  try {
    let q = collection(db, COLLECTIONS.PROFESSIONALS);
    
    if (filters?.category) {
      q = query(q, where('profession', '==', filters.category));
    }
    
    if (filters?.city) {
      q = query(q, where('city', '==', filters.city));
    }
    
    const querySnapshot = await getDocs(q);
    const professionals = [];
    
    querySnapshot.forEach((doc) => {
      professionals.push({ id: doc.id, ...doc.data() });
    });
    
    return professionals;
  } catch (error) {
    console.error('Error getting professionals:', error);
    throw error;
  }
};

export const getProfessional = async (professionalId: string) => {
  try {
    const docRef = doc(db, COLLECTIONS.PROFESSIONALS, professionalId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Professional not found');
    }
  } catch (error) {
    console.error('Error getting professional:', error);
    throw error;
  }
};

export const updateProfessional = async (professionalId: string, updateData: any) => {
  try {
    const docRef = doc(db, COLLECTIONS.PROFESSIONALS, professionalId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: Timestamp.now(),
    });
    console.log('✅ Professional updated:', professionalId);
  } catch (error) {
    console.error('Error updating professional:', error);
    throw error;
  }
};

/**
 * Check if professional can be deleted by user
 * Returns error message if cannot be deleted, null if OK
 */
export const canDeleteProfessional = async (
  professionalId: string, 
  currentUserId: string
): Promise<string | null> => {
  try {
    // Get professional data
    const professionalDoc = await getDoc(doc(db, COLLECTIONS.PROFESSIONALS, professionalId));
    if (!professionalDoc.exists()) {
      return 'Ο επαγγελματίας δεν βρέθηκε';
    }
    
    const professionalData = professionalDoc.data();
    
    // Check if current user is the creator
    if (professionalData.createdBy !== currentUserId) {
      return 'Δεν μπορείτε να διαγράψετε επαγγελματία που δεν έχετε προσθέσει εσείς';
    }
    
    // Check if professional has ANY recommendations (even from the creator)
    // Professional cannot be deleted if it has been recommended by anyone
    const recommendationsQuery = query(
      collection(db, COLLECTIONS.PROFESSIONAL_RECOMMENDATIONS),
      where('professionalId', '==', professionalId)
    );
    const recommendationsSnapshot = await getDocs(recommendationsQuery);
    if (!recommendationsSnapshot.empty) {
      return 'Ο επαγγελματίας έχει προταθεί. Δεν μπορεί να διαγραφεί.';
    }
    
    // Check if professional has ANY appointments (even from the creator)
    // Professional cannot be deleted if it has appointments
    const appointmentsQuery = query(
      collection(db, COLLECTIONS.APPOINTMENTS),
      where('professionalId', '==', professionalId)
    );
    const appointmentsSnapshot = await getDocs(appointmentsQuery);
    if (!appointmentsSnapshot.empty) {
      return 'Ο επαγγελματίας έχει ραντεβού. Δεν μπορεί να διαγραφεί.';
    }
    
    // Check if professional has ANY reviews (even from the creator)
    // Professional cannot be deleted if it has reviews
    const reviewsQuery = query(
      collection(db, COLLECTIONS.REVIEWS),
      where('professionalId', '==', professionalId)
    );
    const reviewsSnapshot = await getDocs(reviewsQuery);
    if (!reviewsSnapshot.empty) {
      return 'Ο επαγγελματίας έχει αξιολογήσεις. Δεν μπορεί να διαγραφεί.';
    }
    
    // All checks passed - can delete
    return null;
  } catch (error) {
    console.error('Error checking if professional can be deleted:', error);
    return 'Σφάλμα κατά τον έλεγχο. Παρακαλώ δοκιμάστε ξανά.';
  }
};

export const deleteProfessional = async (
  professionalId: string,
  currentUserId?: string
) => {
  try {
    // If currentUserId provided, check ownership and usage
    if (currentUserId) {
      const canDelete = await canDeleteProfessional(professionalId, currentUserId);
      if (canDelete) {
        throw new Error(canDelete);
      }
    } else {
      // No userId provided - require admin authentication
      const { requireAdminAuth } = await import('../auth/adminAuth');
      await requireAdminAuth();
    }
    
    const docRef = doc(db, COLLECTIONS.PROFESSIONALS, professionalId);
    await deleteDoc(docRef);
    console.log('✅ Professional deleted:', professionalId);
  } catch (error: any) {
    if (error.message?.includes('ADMIN_REQUIRED')) {
      throw new Error('ADMIN_REQUIRED: Αυτή η λειτουργία απαιτεί admin authentication');
    }
    // Re-throw the error message from canDeleteProfessional
    if (error.message && !error.message.includes('Error deleting')) {
      throw error;
    }
    console.error('Error deleting professional:', error);
    throw error;
  }
};

// Appointment operations
export const createAppointment = async (appointmentData: any) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.APPOINTMENTS), {
      ...appointmentData,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

export const getAppointments = async (userId: string, status?: string) => {
  try {
    let q;
    
    if (status) {
      // Composite query requires index: userId + status + createdAt
      q = query(
        collection(db, COLLECTIONS.APPOINTMENTS),
        where('userId', '==', userId),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
    } else {
      // Composite query requires index: userId + createdAt
      q = query(
        collection(db, COLLECTIONS.APPOINTMENTS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
    }
    
    const querySnapshot = await getDocs(q);
    const appointments = [];
    
    querySnapshot.forEach((doc) => {
      appointments.push({ id: doc.id, ...doc.data() });
    });
    
    return appointments;
  } catch (error: any) {
    console.error('Error getting appointments:', error);
    
    // If index error, provide helpful message
    if (error.code === 'failed-precondition') {
      console.error('⚠️ Firebase Index Required!');
      console.error('Please create the required index in Firebase Console or run:');
      console.error('firebase deploy --only firestore:indexes');
      console.error('Index details:', error.message);
    }
    
    throw error;
  }
};

export const updateAppointment = async (appointmentId: string, updateData: any) => {
  try {
    const docRef = doc(db, COLLECTIONS.APPOINTMENTS, appointmentId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

// Review operations
export const createReview = async (reviewData: any) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.REVIEWS), {
      ...reviewData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const getReviews = async (professionalId: string) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.REVIEWS),
      where('professionalId', '==', professionalId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const reviews = [];
    
    querySnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() });
    });
    
    return reviews;
  } catch (error) {
    console.error('Error getting reviews:', error);
    throw error;
  }
};

export const getUserReviews = async (userId: string) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.REVIEWS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const reviews = [];
    
    querySnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() });
    });
    
    return reviews;
  } catch (error) {
    console.error('Error getting user reviews:', error);
    throw error;
  }
};

// Notification operations
export const createNotification = async (notificationData: any) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
      ...notificationData,
      isRead: false,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const getNotifications = async (userId: string) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.NOTIFICATIONS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const notifications = [];
    
    querySnapshot.forEach((doc) => {
      notifications.push({ id: doc.id, ...doc.data() });
    });
    
    return notifications;
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const docRef = doc(db, COLLECTIONS.NOTIFICATIONS, notificationId);
    await updateDoc(docRef, {
      isRead: true,
      readAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Friend operations
export const sendFriendRequest = async (friendRequestData: any) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.FRIEND_REQUESTS), {
      ...friendRequestData,
      status: 'pending',
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }
};

export const getFriendRequests = async (userId: string) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.FRIEND_REQUESTS),
      where('toUserId', '==', userId),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const requests = [];
    
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    
    return requests;
  } catch (error) {
    console.error('Error getting friend requests:', error);
    throw error;
  }
};

export const respondToFriendRequest = async (requestId: string, response: 'accepted' | 'rejected') => {
  try {
    const docRef = doc(db, COLLECTIONS.FRIEND_REQUESTS, requestId);
    await updateDoc(docRef, {
      status: response,
      respondedAt: Timestamp.now(),
    });
    
    if (response === 'accepted') {
      // Add to friends collection
      const requestDoc = await getDoc(docRef);
      const requestData = requestDoc.data();
      
      await addDoc(collection(db, COLLECTIONS.FRIENDS), {
        userId: requestData.toUserId,
        friendId: requestData.fromUserId,
        friendName: requestData.fromUserName,
        friendEmail: requestData.fromUserEmail,
        createdAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error responding to friend request:', error);
    throw error;
  }
};

// Category/Profession operations
export const getCategories = async () => {
  try {
    const q = query(collection(db, COLLECTIONS.CATEGORIES), orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    const categories = [];
    
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    
    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

export const addCategory = async (categoryData: { name: string; icon?: string }) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.CATEGORIES), {
      name: categoryData.name,
      icon: categoryData.icon || '🔧',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    console.log('✅ Category added to Firestore:', categoryData.name);
    return docRef.id;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

export const updateCategory = async (categoryId: string, updateData: { name?: string; icon?: string }) => {
  try {
    const docRef = doc(db, COLLECTIONS.CATEGORIES, categoryId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: Timestamp.now(),
    });
    console.log('✅ Category updated:', categoryId);
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (categoryId: string) => {
  try {
    // Check admin authentication before delete
    const { requireAdminAuth } = await import('../auth/adminAuth');
    await requireAdminAuth();
    
    const docRef = doc(db, COLLECTIONS.CATEGORIES, categoryId);
    await deleteDoc(docRef);
    console.log('✅ Category deleted:', categoryId);
  } catch (error: any) {
    if (error.message?.includes('ADMIN_REQUIRED')) {
      throw new Error('ADMIN_REQUIRED: Αυτή η λειτουργία απαιτεί admin authentication');
    }
    console.error('Error deleting category:', error);
    throw error;
  }
};

// City operations
export const getCities = async () => {
  try {
    const q = query(collection(db, COLLECTIONS.CITIES), orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    const cities = [];
    
    querySnapshot.forEach((doc) => {
      cities.push({ id: doc.id, ...doc.data() });
    });
    
    return cities;
  } catch (error) {
    console.error('Error getting cities:', error);
    throw error;
  }
};

export const addCity = async (cityData: { name: string }) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.CITIES), {
      name: cityData.name,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    console.log('✅ City added to Firestore:', cityData.name);
    return docRef.id;
  } catch (error) {
    console.error('Error adding city:', error);
    throw error;
  }
};

export const updateCity = async (cityId: string, updateData: { name?: string }) => {
  try {
    const docRef = doc(db, COLLECTIONS.CITIES, cityId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: Timestamp.now(),
    });
    console.log('✅ City updated:', cityId);
  } catch (error) {
    console.error('Error updating city:', error);
    throw error;
  }
};

export const deleteCity = async (cityId: string) => {
  try {
    // Check admin authentication before delete
    const { requireAdminAuth } = await import('../auth/adminAuth');
    await requireAdminAuth();
    
    const docRef = doc(db, COLLECTIONS.CITIES, cityId);
    await deleteDoc(docRef);
    console.log('✅ City deleted:', cityId);
  } catch (error: any) {
    if (error.message?.includes('ADMIN_REQUIRED')) {
      throw new Error('ADMIN_REQUIRED: Αυτή η λειτουργία απαιτεί admin authentication');
    }
    console.error('Error deleting city:', error);
    throw error;
  }
};
