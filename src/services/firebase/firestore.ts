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
import { db } from './config';

// Collections
export const COLLECTIONS = {
  USERS: 'users',
  PROFESSIONALS: 'professionals',
  APPOINTMENTS: 'appointments',
  REVIEWS: 'reviews',
  NOTIFICATIONS: 'notifications',
  FRIENDS: 'friends',
  FRIEND_REQUESTS: 'friendRequests',
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
    let q = query(
      collection(db, COLLECTIONS.APPOINTMENTS),
      where('userId', '==', userId)
    );
    
    if (status) {
      q = query(q, where('status', '==', status));
    }
    
    q = query(q, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const appointments = [];
    
    querySnapshot.forEach((doc) => {
      appointments.push({ id: doc.id, ...doc.data() });
    });
    
    return appointments;
  } catch (error) {
    console.error('Error getting appointments:', error);
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
