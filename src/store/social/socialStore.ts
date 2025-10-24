import { create } from 'zustand';

interface Friend {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'accepted' | 'rejected';
  avatar?: string;
}

interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUserName: string;
  fromUserEmail: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
}

interface SocialState {
  friends: Friend[];
  friendRequests: FriendRequest[];
  isLoading: boolean;
  error: string | null;
}

interface SocialActions {
  addFriend: (friend: Omit<Friend, 'id'>) => void;
  removeFriend: (friendId: string) => void;
  sendFriendRequest: (toUserId: string, toUserName: string, toUserEmail: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  rejectFriendRequest: (requestId: string) => void;
  getFriends: () => Friend[];
  getFriendRequests: () => FriendRequest[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useSocialStore = create<SocialState & SocialActions>((set, get) => ({
  // State
  friends: [],
  friendRequests: [],
  isLoading: false,
  error: null,

  // Actions
  addFriend: (friend) => {
    const newFriend: Friend = {
      ...friend,
      id: Date.now().toString(),
    };
    
    set((state) => ({
      friends: [...state.friends, newFriend],
    }));
  },

  removeFriend: (friendId) => {
    set((state) => ({
      friends: state.friends.filter(friend => friend.id !== friendId),
    }));
  },

  sendFriendRequest: (toUserId, toUserName, toUserEmail) => {
    const newRequest: FriendRequest = {
      id: Date.now().toString(),
      fromUserId: 'current-user-id', // This would be the current user's ID
      toUserId,
      fromUserName: 'Τρέχων Χρήστης', // This would be the current user's name
      fromUserEmail: 'current@example.com', // This would be the current user's email
      status: 'pending',
      timestamp: new Date().toISOString(),
    };
    
    set((state) => ({
      friendRequests: [...state.friendRequests, newRequest],
    }));
  },

  acceptFriendRequest: (requestId) => {
    set((state) => {
      const request = state.friendRequests.find(req => req.id === requestId);
      if (!request) return state;

      // Add to friends
      const newFriend: Friend = {
        id: request.fromUserId,
        name: request.fromUserName,
        email: request.fromUserEmail,
        status: 'accepted',
      };

      return {
        friends: [...state.friends, newFriend],
        friendRequests: state.friendRequests.filter(req => req.id !== requestId),
      };
    });
  },

  rejectFriendRequest: (requestId) => {
    set((state) => ({
      friendRequests: state.friendRequests.filter(req => req.id !== requestId),
    }));
  },

  getFriends: () => {
    return get().friends.filter(friend => friend.status === 'accepted');
  },

  getFriendRequests: () => {
    return get().friendRequests.filter(request => request.status === 'pending');
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },
}));
