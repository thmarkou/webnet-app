import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'professional';
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data based on email
      let mockUser: User;
      
      if (email === 'pro@demo.com') {
        mockUser = {
          id: 'pro1',
          name: 'Γιάννης Παπαδόπουλος',
          email: email,
          phone: '+30 210 1234567',
          role: 'professional'
        };
      } else if (email === 'admin@demo.com') {
        mockUser = {
          id: 'admin1',
          name: 'Διαχειριστής',
          email: email,
          phone: '+30 210 1234567',
          role: 'admin'
        };
      } else {
        mockUser = {
          id: 'user1',
          name: 'Μαρία Παπαδοπούλου',
          email: email,
          phone: '+30 210 1234567',
          role: 'user'
        };
      }
      
      const mockToken = 'mock-jwt-token';
      
      set({ 
        user: mockUser, 
        token: mockToken, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: 'Σφάλμα κατά τη σύνδεση', 
        isLoading: false 
      });
    }
  },

  register: async (userData: any) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        name: userData.name || 'Νέος Χρήστης',
        email: userData.email,
        phone: userData.phone,
        role: userData.role || 'user'
      };
      
      const mockToken = 'mock-jwt-token';
      
      set({ 
        user: mockUser, 
        token: mockToken, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: 'Σφάλμα κατά την εγγραφή', 
        isLoading: false 
      });
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
