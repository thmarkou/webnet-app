import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      
      // First try AsyncStorage
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
      
      // Then try demo accounts
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
      
      // Generate unique user ID
      const userId = `user_${Date.now()}`;
      
      // Create user object
      const newUser: User = {
        id: userId,
        name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Νέος Χρήστης',
        email: userData.email,
        phone: userData.phone,
        role: userData.role || 'user',
        profession: userData.profession
      };
      
      // Save to AsyncStorage
      try {
        const existingUsersJson = await AsyncStorage.getItem('app_users');
        const users = existingUsersJson ? JSON.parse(existingUsersJson) : [];
        users.push({ ...newUser, password: userData.password }); // Store password for demo
        await AsyncStorage.setItem('app_users', JSON.stringify(users));
        console.log('✅ User registered:', newUser.name);
      } catch (storageError) {
        console.error('Error saving user:', storageError);
      }
      
      // DON'T auto-login after registration
      // Just mark registration as complete
      set({ 
        isLoading: false,
        error: null
      });
      
      // Return the new user object for confirmation message
      return newUser;
    } catch (error) {
      set({ 
        error: 'Σφάλμα κατά την εγγραφή', 
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
