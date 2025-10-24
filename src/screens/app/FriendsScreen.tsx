import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { triggerFriendRequestNotification } from '../../services/notifications/mockNotifications';

export default function FriendsScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const mockFriends = [
    {
      id: '1',
      name: 'John Smith',
      profession: 'Software Engineer',
      location: 'Αθήνα',
      status: 'friend',
      avatar: '👤'
    },
    {
      id: '2',
      name: 'Maria Papadopoulou',
      profession: 'Teacher',
      location: 'Θεσσαλονίκη',
      status: 'friend',
      avatar: '👤'
    },
    {
      id: '3',
      name: 'Alex Johnson',
      profession: 'Marketing Manager',
      location: 'Αθήνα',
      status: 'friend',
      avatar: '👤'
    }
  ];

  const mockSuggestions = [
    {
      id: '1',
      name: 'Anna Petrou',
      profession: 'Nurse',
      reason: 'Mutual friends: John Smith, Maria Papadopoulou, Alex Johnson',
      avatar: '👤'
    },
    {
      id: '2',
      name: 'Tom Wilson',
      profession: 'Sales Manager',
      reason: 'You live in the same city',
      avatar: '👤'
    },
    {
      id: '3',
      name: 'Lisa Brown',
      profession: 'Project Manager',
      reason: 'Mutual friends: John Smith, Maria Papadopoulou, Alex Johnson, Sarah Wilson, Mike Chen',
      avatar: '👤'
    }
  ];

  useEffect(() => {
    setFriends(mockFriends);
    setSuggestions(mockSuggestions);
  }, []);

  const handleAddFriend = (suggestionId) => {
    // Add friend logic here
    console.log('Adding friend:', suggestionId);
  };

  const renderFriend = ({ item }) => (
    <View style={styles.friendCard}>
      <View style={styles.friendInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.avatar}</Text>
        </View>
        <View style={styles.friendDetails}>
          <Text style={styles.friendName}>{item.name}</Text>
          <Text style={styles.friendProfession}>{item.profession} • {item.location}</Text>
          <Text style={styles.friendStatus}>Φίλος</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.messageButton}>
        <Text style={styles.messageIcon}>💬</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSuggestion = ({ item }) => (
    <View style={styles.suggestionCard}>
      <View style={styles.suggestionInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.avatar}</Text>
        </View>
        <View style={styles.suggestionDetails}>
          <Text style={styles.suggestionName}>{item.name}</Text>
          <Text style={styles.suggestionProfession}>{item.profession}</Text>
          <Text style={styles.suggestionReason}>{item.reason}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => handleAddFriend(item.id)}
      >
        <Text style={styles.addButtonIcon}>👤+</Text>
      </TouchableOpacity>
    </View>
  );

  const tabs = [
    { id: 'friends', title: 'Φίλοι' },
    { id: 'requests', title: 'Αιτήματα' },
    { id: 'suggestions', title: 'Προτάσεις' },
    { id: 'search', title: 'Αναζήτηση' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Φίλοι</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {activeTab === 'friends' && (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Φίλοι (3)</Text>
          <FlatList
            data={friends}
            renderItem={renderFriend}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      )}

      {activeTab === 'suggestions' && (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Προτάσεις</Text>
          <FlatList
            data={suggestions}
            renderItem={renderSuggestion}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      )}

      {activeTab === 'requests' && (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Αιτήματα</Text>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Δεν υπάρχουν αιτήματα</Text>
          </View>
        </View>
      )}

      {activeTab === 'search' && (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Αναζήτηση</Text>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Αναζήτηση φίλων</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3b82f6',
    backgroundColor: '#3b82f6',
  },
  tabText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  friendCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f3f4',
  },
  suggestionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f3f4',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  suggestionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    color: '#6b7280',
  },
  friendDetails: {
    flex: 1,
  },
  suggestionDetails: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  friendProfession: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  suggestionProfession: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  friendStatus: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  suggestionReason: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageIcon: {
    fontSize: 18,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonIcon: {
    fontSize: 16,
    color: '#ffffff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
});