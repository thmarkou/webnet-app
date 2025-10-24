// Mock messaging service - no Firebase dependencies
export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  messageType: 'text' | 'image' | 'file';
  appointmentId?: string;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage?: Message;
  lastMessageTime?: Date;
  appointmentId?: string;
  isActive: boolean;
}

// Mock messages storage
let mockMessages: Message[] = [
  {
    id: '1',
    senderId: 'user1',
    recipientId: 'pro1',
    content: 'Γεια σας! Θα ήθελα να κλείσω ραντεβού για επισκευή υδραυλικών.',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    isRead: true,
    messageType: 'text',
    appointmentId: 'apt1'
  },
  {
    id: '2',
    senderId: 'pro1',
    recipientId: 'user1',
    content: 'Γεια σας! Φυσικά, μπορώ να σας βοηθήσω. Πότε θα σας βόλευε;',
    timestamp: new Date(Date.now() - 3000000), // 50 minutes ago
    isRead: true,
    messageType: 'text',
    appointmentId: 'apt1'
  },
  {
    id: '3',
    senderId: 'user1',
    recipientId: 'pro1',
    content: 'Θα μπορούσατε να έρθετε αύριο το απόγευμα;',
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    isRead: false,
    messageType: 'text',
    appointmentId: 'apt1'
  },
  // New mock messages for different users
  {
    id: '4',
    senderId: 'user2',
    recipientId: 'user1',
    content: 'Γεια! Πώς πάει η δουλειά;',
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    isRead: false,
    messageType: 'text'
  },
  {
    id: '5',
    senderId: 'user1',
    recipientId: 'user2',
    content: 'Καλά, ευχαριστώ! Εσύ πώς είσαι;',
    timestamp: new Date(Date.now() - 7000000), // ~1.9 hours ago
    isRead: true,
    messageType: 'text'
  },
  {
    id: '6',
    senderId: 'user2',
    recipientId: 'user1',
    content: 'Καλά και εγώ! Θα ήθελα να σου μιλήσω για κάτι σημαντικό.',
    timestamp: new Date(Date.now() - 6000000), // ~1.7 hours ago
    isRead: false,
    messageType: 'text'
  },
  {
    id: '7',
    senderId: 'pro1',
    recipientId: 'user1',
    content: 'Το ραντεβού για αύριο επιβεβαιώνεται στις 15:00.',
    timestamp: new Date(Date.now() - 900000), // 15 minutes ago
    isRead: false,
    messageType: 'text',
    appointmentId: 'apt1'
  },
  {
    id: '8',
    senderId: 'user3',
    recipientId: 'user1',
    content: 'Γεια! Έχεις δει το νέο επαγγελματία που προτείνω;',
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    isRead: false,
    messageType: 'text'
  }
];

// Mock chat rooms storage
let mockChatRooms: ChatRoom[] = [
  {
    id: 'chat1',
    participants: ['user1', 'pro1'],
    lastMessage: mockMessages[6], // Latest message from pro1
    lastMessageTime: mockMessages[6].timestamp,
    appointmentId: 'apt1',
    isActive: true
  },
  {
    id: 'chat2',
    participants: ['user1', 'user2'],
    lastMessage: mockMessages[5], // Latest message from user1
    lastMessageTime: mockMessages[5].timestamp,
    isActive: true
  },
  {
    id: 'chat3',
    participants: ['user1', 'user3'],
    lastMessage: mockMessages[7], // Latest message from user3
    lastMessageTime: mockMessages[7].timestamp,
    isActive: true
  }
];

// Mock messaging functions
export const sendMessage = async (messageData: Omit<Message, 'id' | 'timestamp'>) => {
  const message: Message = {
    ...messageData,
    id: Date.now().toString(),
    timestamp: new Date(),
  };
  
  mockMessages.push(message);
  
  // Update chat room's last message
  const chatRoom = mockChatRooms.find(room => 
    room.participants.includes(messageData.recipientId) && 
    room.participants.includes(messageData.senderId)
  );
  
  if (chatRoom) {
    chatRoom.lastMessage = message;
    chatRoom.lastMessageTime = message.timestamp;
  }
  
  return message.id;
};

export const getMessages = async (userId1: string, userId2: string, limitCount: number = 50): Promise<Message[]> => {
  return mockMessages
    .filter(msg => 
      (msg.senderId === userId1 && msg.recipientId === userId2) ||
      (msg.senderId === userId2 && msg.recipientId === userId1)
    )
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .slice(-limitCount);
};

// Real-time simulation with setInterval
export const subscribeToMessages = (
  userId1: string, 
  userId2: string, 
  callback: (messages: Message[]) => void
) => {
  const updateMessages = () => {
    const messages = mockMessages
      .filter(msg => 
        (msg.senderId === userId1 && msg.recipientId === userId2) ||
        (msg.senderId === userId2 && msg.recipientId === userId1)
      )
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    callback(messages);
  };
  
  // Initial call
  updateMessages();
  
  // Simulate real-time updates every 3 seconds
  const interval = setInterval(updateMessages, 3000);
  
  // Return unsubscribe function
  return () => clearInterval(interval);
};

export const getOrCreateChatRoom = async (userId1: string, userId2: string, appointmentId?: string): Promise<ChatRoom & { id: string }> => {
  // Check if chat room already exists
  const existingRoom = mockChatRooms.find(room => 
    room.participants.includes(userId1) && room.participants.includes(userId2)
  );
  
  if (existingRoom) {
    return { id: existingRoom.id, ...existingRoom };
  }
  
  // Create new chat room
  const newChatRoom: ChatRoom = {
    id: `chat_${Date.now()}`,
    participants: [userId1, userId2],
    isActive: true,
    appointmentId,
    lastMessageTime: new Date(),
  };
  
  mockChatRooms.push(newChatRoom);
  return { id: newChatRoom.id, ...newChatRoom };
};

export const getUserChatRooms = async (userId: string): Promise<(ChatRoom & { id: string })[]> => {
  return mockChatRooms
    .filter(room => room.participants.includes(userId))
    .sort((a, b) => (b.lastMessageTime?.getTime() || 0) - (a.lastMessageTime?.getTime() || 0))
    .map(room => ({ id: room.id, ...room }));
};

export const markMessagesAsRead = async (userId: string, senderId: string) => {
  mockMessages.forEach(msg => {
    if (msg.senderId === senderId && msg.recipientId === userId && !msg.isRead) {
      msg.isRead = true;
    }
  });
};

// Get unread message count for a user
export const getUnreadMessageCount = async (userId: string): Promise<number> => {
  return mockMessages.filter(msg => 
    msg.recipientId === userId && !msg.isRead
  ).length;
};

// Get unread message count for a specific chat
export const getUnreadChatCount = async (userId: string, senderId: string): Promise<number> => {
  return mockMessages.filter(msg => 
    msg.senderId === senderId && msg.recipientId === userId && !msg.isRead
  ).length;
};
