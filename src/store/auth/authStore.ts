import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUser, getUserByEmail } from '../../services/firebase/firestore';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'professional' | 'admin';
  profession?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  // State
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  // Actions
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // First try Firestore (common database)
      try {
        const firestoreUser = await getUserByEmail(email);
        
        if (firestoreUser) {
          // Check password (in production, use proper password hashing!)
          if (firestoreUser.password === password) {
            const user: User = {
              id: firestoreUser.id,
              name: firestoreUser.name || 'Χρήστης',
              email: firestoreUser.email,
              phone: firestoreUser.phone,
              role: firestoreUser.role || 'user',
              profession: firestoreUser.profession
            };
            
            set({ 
              user, 
              token: 'firestore-jwt-token', 
              isAuthenticated: true, 
              isLoading: false 
            });
            console.log('✅ User logged in from Firestore:', user.email);
            return;
          }
        }
      } catch (firestoreError) {
        console.log('⚠️ Firestore login failed, trying AsyncStorage fallback');
      }
      
      // Fallback to AsyncStorage (for migration period)
      try {
        const usersJson = await AsyncStorage.getItem('app_users');
        const users = usersJson ? JSON.parse(usersJson) : [];
        const foundUser = users.find((u: any) => u.email === email && u.password === password);
        
        if (foundUser) {
          const mockUser: User = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            phone: foundUser.phone,
            role: foundUser.role,
            profession: foundUser.profession
          };
          
          set({ 
            user: mockUser, 
            token: 'mock-jwt-token', 
            isAuthenticated: true, 
            isLoading: false 
          });
          return;
        }
      } catch (storageError) {
        console.error('Error loading from storage:', storageError);
      }
      
      // Then try demo accounts (for testing)
      let mockUser: User;
      if (email === 'user@demo.com' && password === 'demo') {
        mockUser = { id: 'user1', name: 'Μιχάλης Σκαλτσουνάκης', email, phone: '+30 210 1234567', role: 'user' };
      } else if (email === 'pro@demo.com' && password === 'demo') {
        mockUser = { id: 'pro1', name: 'Χάρης Σκαλτσουνάκης', email, phone: '+30 210 1234567', role: 'professional', profession: 'Ασφαλιστής' };
      } else if (email === 'admin@demo.com' && password === 'demo') {
        mockUser = { id: 'admin1', name: 'Fabio Marcoulini', email, phone: '+30 210 1234567', role: 'admin', profession: 'Chief Technology Officer' };
      } else {
        throw new Error('Λάθος email ή password');
      }
      
      set({ user: mockUser, token: 'mock-jwt-token', isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Σφάλμα κατά τη σύνδεση', 
        isLoading: false 
      });
    }
  },

  register: async (userData: any) => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if user already exists in Firestore
      try {
        const existingUser = await getUserByEmail(userData.email);
        if (existingUser) {
          throw new Error('Το email χρησιμοποιείται ήδη');
        }
      } catch (checkError: any) {
        if (checkError.message === 'Το email χρησιμοποιείται ήδη') {
          throw checkError;
        }
        // Ignore other errors (might be network issue)
      }
      
      // Create user object for Firestore
      const userDataToSave = {
        name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Νέος Χρήστης',
        email: userData.email,
        phone: userData.phone,
        password: userData.password, // ⚠️ In production, hash this password!
        role: userData.role || 'user',
        profession: userData.profession,
        firstName: userData.firstName,
        lastName: userData.lastName,
        occupation: userData.occupation,
        location: userData.location,
        notifications: userData.notifications !== false,
      };
      
      // Save to Firestore (common database)
      let userId: string;
      try {
        userId = await createUser(userDataToSave);
        console.log('✅ User registered in Firestore:', userDataToSave.name, 'ID:', userId);
      } catch (firestoreError) {
        console.error('Error saving user to Firestore:', firestoreError);
        // Fallback to AsyncStorage
        const userId = `user_${Date.now()}`;
        const newUser: User = {
          id: userId,
          name: userDataToSave.name,
          email: userDataToSave.email,
          phone: userDataToSave.phone,
          role: userDataToSave.role as 'user' | 'professional' | 'admin',
          profession: userDataToSave.profession
        };
        
        try {
          const existingUsersJson = await AsyncStorage.getItem('app_users');
          const users = existingUsersJson ? JSON.parse(existingUsersJson) : [];
          users.push({ ...newUser, password: userData.password });
          await AsyncStorage.setItem('app_users', JSON.stringify(users));
          console.log('⚠️ User saved to AsyncStorage fallback:', newUser.name);
        } catch (storageError) {
          console.error('Error saving user to AsyncStorage:', storageError);
          throw new Error('Αδυναμία αποθήκευσης χρήστη');
        }
        
        set({ isLoading: false, error: null });
        return newUser;
      }
      
      // Create user object for return
      const newUser: User = {
        id: userId,
        name: userDataToSave.name,
        email: userDataToSave.email,
        phone: userDataToSave.phone,
        role: userDataToSave.role as 'user' | 'professional' | 'admin',
        profession: userDataToSave.profession
      };
      
      // DON'T auto-login after registration
      // Just mark registration as complete
      set({ 
        isLoading: false,
        error: null
      });
      
      // Return the new user object for confirmation message
      return newUser;
    } catch (error: any) {
      set({ 
        error: error.message || 'Σφάλμα κατά την εγγραφή', 
        isLoading: false 
      });
      throw error;
    }
  },

  logout: () => {
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false, 
      error: null 
    });
  },

  setUser: (user: User) => {
    set({ user, isAuthenticated: true });
  },

  setToken: (token: string) => {
    set({ token });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  logout: () => {
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false, 
      error: null 
    });
  }
}));
