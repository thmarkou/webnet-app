import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  TextInput 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { triggerFriendRequestNotification } from '../../services/notifications/mockNotifications';
import { getUnreadChatCount } from '../../services/messaging/mockMessaging';
import { useAuthStore } from '../../store/auth/authStore';

export default function FriendsScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Fetch unread message counts for each friend
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      if (user?.id) {
        const counts = {};
        for (const friend of mockFriends) {
          try {
            const count = await getUnreadChatCount(user.id, friend.id);
            counts[friend.id] = count;
          } catch (error) {
            console.error(`Error fetching unread count for ${friend.id}:`, error);
            counts[friend.id] = 0;
          }
        }
        setUnreadCounts(counts);
      }
    };

    fetchUnreadCounts();
    
    // Update every 5 seconds to simulate real-time updates
    const interval = setInterval(fetchUnreadCounts, 5000);
    
    return () => clearInterval(interval);
  }, [user?.id]);

  const mockFriends = [
    {
      id: 'user2',
      name: 'Μαρία Παπαδοπούλου',
      profession: 'Δασκάλα',
      location: 'Θεσσαλονίκη',
      status: 'friend',
      avatar: '👩'
    },
    {
      id: 'user3',
      name: 'Γιάννης Παπαδόπουλος',
      profession: 'Μηχανικός',
      location: 'Αθήνα',
      status: 'friend',
      avatar: '👨'
    },
    {
      id: 'pro1',
      name: 'Χάρης Σκαλτσουνάκης',
      profession: 'Ασφαλιστής',
      location: 'Αθήνα',
      status: 'friend',
      avatar: '👨‍💼'
    }
  ];

  const mockSuggestions = [
    {
      id: '1',
      name: 'Άννα Πετρού',
      profession: 'Νοσοκόμα',
      reason: 'Κοινός φίλος: Μιχάλης Σκαλτσουνάκης, Μαρία Παπαδοπούλου, Αλέξης Ιωάννου',
      avatar: '👤'
    },
    {
      id: '2',
      name: 'Θωμάς Γουίλσον',
      profession: 'Διευθυντής Πωλήσεων',
      reason: 'Ζείτε στην ίδια πόλη',
      avatar: '👤'
    },
    {
      id: '3',
      name: 'Λίζα Μπράουν',
      profession: 'Διευθύντρια Έργων',
      reason: 'Κοινός φίλος: Μιχάλης Σκαλτσουνάκης, Μαρία Παπαδοπούλου, Αλέξης Ιωάννου, Σάρα Γουίλσον, Μάικ Τσεν',
      avatar: '👤'
    }
  ];

  useEffect(() => {
    setFriends(mockFriends);
    setSuggestions(mockSuggestions);
  }, []);

  const handleAddFriend = async (suggestionId) => {
    try {
      // Find the suggestion to add
      const suggestion = mockSuggestions.find(s => s.id === suggestionId);
      if (!suggestion) return;

      // Create new friend from suggestion
      const newFriend = {
        id: suggestionId,
        name: suggestion.name,
        profession: suggestion.profession,
        status: 'friend',
        avatar: suggestion.avatar
      };

      // Add to friends list
      setFriends(prevFriends => [...prevFriends, newFriend]);
      
      // Remove from suggestions
      setSuggestions(prevSuggestions => 
        prevSuggestions.filter(s => s.id !== suggestionId)
      );

      // Trigger friend request notification
      await triggerFriendRequestNotification(suggestionId, user.id, user.name);

      console.log('Friend added successfully:', suggestion.name);
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    // Mock search results - in real app, this would be an API call
    const mockSearchResults = [
      {
        id: 'search1',
        name: 'Μαρία Παπαδοπούλου',
        profession: 'Γιατρός',
        avatar: '👩‍⚕️',
        status: 'not_friend'
      },
      {
        id: 'search2',
        name: 'Νίκος Κωνσταντίνου',
        profession: 'Μηχανικός',
        avatar: '👨‍🔧',
        status: 'not_friend'
      },
      {
        id: 'search3',
        name: 'Άννα Δημητρίου',
        profession: 'Δικηγόρος',
        avatar: '👩‍⚖️',
        status: 'not_friend'
      }
    ].filter(person => 
      person.name.toLowerCase().includes(query.toLowerCase()) ||
      person.profession.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(mockSearchResults);
  };

  const handleAddSearchResult = async (searchResultId) => {
    try {
      const searchResult = searchResults.find(s => s.id === searchResultId);
      if (!searchResult) return;

      const newFriend = {
        id: searchResultId,
        name: searchResult.name,
        profession: searchResult.profession,
        status: 'friend',
        avatar: searchResult.avatar
      };

      setFriends(prevFriends => [...prevFriends, newFriend]);
      setSearchResults(prevResults => 
        prevResults.filter(s => s.id !== searchResultId)
      );

      // Trigger friend request notification
      await triggerFriendRequestNotification(searchResultId, user.id, user.name);

      console.log('Friend added from search:', searchResult.name);
    } catch (error) {
      console.error('Error adding friend from search:', error);
    }
  };

  const renderFriend = ({ item }) => {
    const unreadCount = unreadCounts[item.id] || 0;
    
    return (
      <View style={styles.friendCard}>
        <View style={styles.friendInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.avatar}</Text>
            {/* Unread message indicator */}
            {unreadCount > 0 && (
              <View style={styles.unreadIndicator}>
                <Text style={styles.unreadCount}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.friendDetails}>
            <Text style={styles.friendName}>{item.name}</Text>
            <Text style={styles.friendProfession}>{item.profession} • {item.location}</Text>
            <Text style={styles.friendStatus}>Φίλος</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.messageButton}
          onPress={() => navigation.navigate('Chat', { 
            senderId: item.id, 
            professionalName: item.name 
          })}
        >
          <Text style={styles.messageIcon}>💬</Text>
        </TouchableOpacity>
      </View>
    );
  };

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

  const getTabColor = (tabId) => {
    switch (tabId) {
      case 'friends': return '#10b981'; // Green
      case 'requests': return '#f59e0b'; // Orange
      case 'suggestions': return '#3b82f6'; // Blue
      case 'search': return '#8b5cf6'; // Purple
      default: return '#6b7280';
    }
  };

  const getTabIcon = (tabId) => {
    switch (tabId) {
      case 'friends': return '👤';
      case 'requests': return '📨';
      case 'suggestions': return '💡';
      case 'search': return '🔍';
      default: return '👤';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Φίλοι</Text>
          <Text style={styles.userName}>{user?.name || 'Χρήστη'}</Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <View style={styles.tabRow}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabPill, 
                { 
                  backgroundColor: getTabColor(tab.id) + '20',
                  flex: 1,
                  marginHorizontal: 4
                }
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <View style={styles.tabPillContent}>
                <Text style={styles.tabPillIcon}>{getTabIcon(tab.id)}</Text>
                <Text style={[styles.tabPillText, { color: getTabColor(tab.id) }]}>
                  {tab.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
          
          {/* Search Input */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Αναζήτηση φίλων..."
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Search Results */}
          {searchQuery.trim() !== '' && (
            <View style={styles.searchResultsContainer}>
              <Text style={styles.searchResultsTitle}>
                Αποτελέσματα Αναζήτησης ({searchResults.length})
              </Text>
              
              {searchResults.length > 0 ? (
                <FlatList
                  data={searchResults}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.searchResultCard}>
                      <View style={styles.searchResultInfo}>
                        <Text style={styles.searchResultAvatar}>{item.avatar}</Text>
                        <View style={styles.searchResultDetails}>
                          <Text style={styles.searchResultName}>{item.name}</Text>
                          <Text style={styles.searchResultProfession}>{item.profession}</Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.addFriendButton}
                        onPress={() => handleAddSearchResult(item.id)}
                      >
                        <Text style={styles.addFriendButtonText}>Προσθήκη</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>
                    Δεν βρέθηκαν αποτελέσματα για "{searchQuery}"
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Empty State */}
          {searchQuery.trim() === '' && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Αναζήτηση φίλων</Text>
              <Text style={styles.emptySubtext}>
                Εισάγετε όνομα ή επάγγελμα για να βρείτε φίλους
              </Text>
            </View>
          )}
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
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  userName: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 2,
  },
  tabContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 2,
    minHeight: 36,
  },
  tabPillContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabPillIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  tabPillText: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    numberOfLines: 1,
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
    position: 'relative',
  },
  avatarText: {
    fontSize: 20,
    color: '#6b7280',
  },
  unreadIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#10b981',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  unreadCount: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
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
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchResultsContainer: {
    marginTop: 8,
  },
  searchResultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  searchResultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchResultInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchResultAvatar: {
    fontSize: 24,
    marginRight: 12,
  },
  searchResultDetails: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  searchResultProfession: {
    fontSize: 14,
    color: '#6b7280',
  },
  addFriendButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addFriendButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  noResultsContainer: {
    padding: 32,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});