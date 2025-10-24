import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc,
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Timestamp;
  isRead: boolean;
  messageType: 'text' | 'image' | 'file';
  appointmentId?: string;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage?: Message;
  lastMessageTime?: Timestamp;
  appointmentId?: string;
  isActive: boolean;
}

// Create a new message
export const sendMessage = async (messageData: Omit<Message, 'id' | 'timestamp'>) => {
  try {
    const message = {
      ...messageData,
      timestamp: Timestamp.now(),
    };
    
    const docRef = await addDoc(collection(db, 'messages'), message);
    
    // Update chat room's last message
    await updateChatRoomLastMessage(messageData.recipientId, messageData.senderId, message);
    
    return docRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Get messages between two users
export const getMessages = async (userId1: string, userId2: string, limitCount: number = 50) => {
  try {
    const q = query(
      collection(db, 'messages'),
      where('senderId', 'in', [userId1, userId2]),
      where('recipientId', 'in', [userId1, userId2]),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const messages: Message[] = [];
    
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      } as Message);
    });
    
    return messages.reverse(); // Return in chronological order
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

// Real-time message listener
export const subscribeToMessages = (
  userId1: string, 
  userId2: string, 
  callback: (messages: Message[]) => void
) => {
  const q = query(
    collection(db, 'messages'),
    where('senderId', 'in', [userId1, userId2]),
    where('recipientId', 'in', [userId1, userId2]),
    orderBy('timestamp', 'desc'),
    limit(50)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const messages: Message[] = [];
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      } as Message);
    });
    callback(messages.reverse()); // Return in chronological order
  });
};

// Get or create chat room
export const getOrCreateChatRoom = async (userId1: string, userId2: string, appointmentId?: string) => {
  try {
    // Check if chat room already exists
    const q = query(
      collection(db, 'chatRooms'),
      where('participants', 'array-contains', userId1)
    );
    
    const querySnapshot = await getDocs(q);
    
    for (const doc of querySnapshot.docs) {
      const chatRoom = doc.data() as ChatRoom;
      if (chatRoom.participants.includes(userId2)) {
        return { id: doc.id, ...chatRoom };
      }
    }
    
    // Create new chat room if none exists
    const newChatRoom = {
      participants: [userId1, userId2],
      isActive: true,
      appointmentId,
      lastMessageTime: Timestamp.now(),
    };
    
    const docRef = await addDoc(collection(db, 'chatRooms'), newChatRoom);
    return { id: docRef.id, ...newChatRoom };
  } catch (error) {
    console.error('Error getting/creating chat room:', error);
    throw error;
  }
};

// Update chat room's last message
const updateChatRoomLastMessage = async (recipientId: string, senderId: string, message: Message) => {
  try {
    const q = query(
      collection(db, 'chatRooms'),
      where('participants', 'array-contains', senderId)
    );
    
    const querySnapshot = await getDocs(q);
    
    for (const doc of querySnapshot.docs) {
      const chatRoom = doc.data() as ChatRoom;
      if (chatRoom.participants.includes(recipientId)) {
        await updateDoc(doc.ref, {
          lastMessage: message,
          lastMessageTime: message.timestamp,
        });
        break;
      }
    }
  } catch (error) {
    console.error('Error updating chat room:', error);
  }
};

// Get user's chat rooms
export const getUserChatRooms = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'chatRooms'),
      where('participants', 'array-contains', userId),
      orderBy('lastMessageTime', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const chatRooms: (ChatRoom & { id: string })[] = [];
    
    querySnapshot.forEach((doc) => {
      chatRooms.push({
        id: doc.id,
        ...doc.data()
      } as ChatRoom & { id: string });
    });
    
    return chatRooms;
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    throw error;
  }
};

// Mark messages as read
export const markMessagesAsRead = async (userId: string, senderId: string) => {
  try {
    const q = query(
      collection(db, 'messages'),
      where('senderId', '==', senderId),
      where('recipientId', '==', userId),
      where('isRead', '==', false)
    );
    
    const querySnapshot = await getDocs(q);
    const updatePromises = querySnapshot.docs.map(doc => 
      updateDoc(doc.ref, { isRead: true })
    );
    
    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};
