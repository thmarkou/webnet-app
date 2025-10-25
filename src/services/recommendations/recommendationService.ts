import { ProfessionalRecommendation, FriendRecommendation, RecommendationStats } from '../../types/recommendations';

class RecommendationService {
  private recommendations: ProfessionalRecommendation[] = [];
  private friendRecommendations: FriendRecommendation[] = [];

  // Initialize with mock data
  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock friend recommendations
    this.friendRecommendations = [
      {
        friendId: 'user2',
        friendName: 'Μαρία Παπαδοπούλου',
        recommendations: [
          {
            id: 'rec1',
            recommenderId: 'user2',
            recommenderName: 'Μαρία Παπαδοπούλου',
            professionalId: '1',
            professionalName: 'Γιάννης Παπαδόπουλος',
            profession: 'Ηλεκτρολόγος',
            city: 'Αθήνα',
            rating: 4.8,
            reason: 'Εξαιρετικός επαγγελματίας, πολύ ευγενικός και επαγγελματικός',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            isActive: true,
          },
          {
            id: 'rec2',
            recommenderId: 'user2',
            recommenderName: 'Μαρία Παπαδοπούλου',
            professionalId: '2',
            professionalName: 'Μαρία Κωστόπουλου',
            profession: 'Υδραυλικός',
            city: 'Αθήνα',
            rating: 4.9,
            reason: 'Εξαιρετική επαγγελματίας, πολύ ευγενική και γρήγορη!',
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
            isActive: true,
          },
        ],
      },
      {
        friendId: 'user3',
        friendName: 'Γιάννης Παπαδόπουλος',
        recommendations: [
          {
            id: 'rec3',
            recommenderId: 'user3',
            recommenderName: 'Γιάννης Παπαδόπουλος',
            professionalId: 'pro3',
            professionalName: 'Αννα Ηλεκτρολόγος',
            profession: 'Ηλεκτρολόγος',
            city: 'Θεσσαλονίκη',
            rating: 4.7,
            reason: 'Πολύ καλή τιμή και γρήγορη εξυπηρέτηση',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
            isActive: true,
          },
        ],
      },
      {
        friendId: '1',
        friendName: 'Άννα Πετρού',
        recommendations: [
          {
            id: 'rec4',
            recommenderId: '1',
            recommenderName: 'Άννα Πετρού',
            professionalId: 'pro4',
            professionalName: 'Δημήτρης Γιατρούς',
            profession: 'Γιατρός',
            city: 'Αθήνα',
            rating: 4.9,
            reason: 'Εξαιρετικός γιατρός, πολύ προσεκτικός και ευγενικός',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            isActive: true,
          },
        ],
      },
      {
        friendId: '3',
        friendName: 'Λίζα Μπράουν',
        recommendations: [
          {
            id: 'rec5',
            recommenderId: '3',
            recommenderName: 'Λίζα Μπράουν',
            professionalId: 'pro5',
            professionalName: 'Κώστας Αρχιτέκτονας',
            profession: 'Αρχιτέκτονας',
            city: 'Θεσσαλονίκη',
            rating: 4.6,
            reason: 'Καταπληκτικός αρχιτέκτονας, πολύ δημιουργικός',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            isActive: true,
          },
        ],
      },
    ];

    // Flatten all recommendations
    this.recommendations = this.friendRecommendations.flatMap(fr => fr.recommendations);
  }

  // Get recommendations by a specific friend
  getFriendRecommendations(friendId: string): ProfessionalRecommendation[] {
    const friendRec = this.friendRecommendations.find(fr => fr.friendId === friendId);
    return friendRec ? friendRec.recommendations : [];
  }

  // Get all recommendations for a user's friends
  getFriendsRecommendationsForUser(userId: string, friendsList: string[]): ProfessionalRecommendation[] {
    return this.recommendations.filter(rec => 
      friendsList.includes(rec.recommenderId) && rec.isActive
    );
  }

  // Get recommendations for a specific profession and city
  getRecommendationsForSearch(
    userId: string, 
    friendsList: string[], 
    profession: string, 
    city: string
  ): ProfessionalRecommendation[] {
    return this.recommendations.filter(rec => 
      friendsList.includes(rec.recommenderId) && 
      rec.isActive &&
      rec.profession.toLowerCase().includes(profession.toLowerCase()) &&
      rec.city.toLowerCase().includes(city.toLowerCase())
    );
  }

  // Get all recommendations (for admin)
  getAllRecommendations(): ProfessionalRecommendation[] {
    return this.recommendations.filter(rec => rec.isActive);
  }

  // Get recommendation statistics
  getRecommendationStats(): RecommendationStats {
    const totalRecommendations = this.recommendations.length;
    
    const recommendationsByCategory = this.recommendations.reduce((acc, rec) => {
      acc[rec.profession] = (acc[rec.profession] || 0) + 1;
      return acc;
    }, {} as { [category: string]: number });

    const recommenderCounts = this.recommendations.reduce((acc, rec) => {
      acc[rec.recommenderId] = (acc[rec.recommenderId] || 0) + 1;
      return acc;
    }, {} as { [userId: string]: number });

    const topRecommenders = Object.entries(recommenderCounts)
      .map(([userId, count]) => {
        const rec = this.recommendations.find(r => r.recommenderId === userId);
        return {
          userId,
          name: rec?.recommenderName || 'Unknown',
          count,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalRecommendations,
      recommendationsByCategory,
      topRecommenders,
    };
  }

  // Add a new recommendation (for future use)
  addRecommendation(
    recommenderId: string,
    recommenderName: string,
    professionalId: string,
    professionalName: string,
    profession: string,
    city: string,
    rating: number,
    reason?: string
  ): ProfessionalRecommendation {
    const newRecommendation: ProfessionalRecommendation = {
      id: `rec_${Date.now()}`,
      recommenderId,
      recommenderName,
      professionalId,
      professionalName,
      profession,
      city,
      rating,
      reason,
      createdAt: new Date(),
      isActive: true,
    };

    this.recommendations.push(newRecommendation);

    // Update friend recommendations
    let friendRec = this.friendRecommendations.find(fr => fr.friendId === recommenderId);
    if (!friendRec) {
      friendRec = {
        friendId: recommenderId,
        friendName: recommenderName,
        recommendations: [],
      };
      this.friendRecommendations.push(friendRec);
    }
    friendRec.recommendations.push(newRecommendation);

    return newRecommendation;
  }

  // Remove a recommendation
  removeRecommendation(recommendationId: string): boolean {
    const index = this.recommendations.findIndex(rec => rec.id === recommendationId);
    if (index !== -1) {
      this.recommendations[index].isActive = false;
      return true;
    }
    return false;
  }

  // Get recommendations by professional ID
  getRecommendationsForProfessional(professionalId: string): ProfessionalRecommendation[] {
    return this.recommendations.filter(rec => 
      rec.professionalId === professionalId && rec.isActive
    );
  }

  // Check if a professional is recommended by friends
  isProfessionalRecommendedByFriends(
    professionalId: string, 
    userId: string, 
    friendsList: string[]
  ): ProfessionalRecommendation | null {
    return this.recommendations.find(rec => 
      rec.professionalId === professionalId &&
      friendsList.includes(rec.recommenderId) &&
      rec.isActive
    ) || null;
  }
}

export const recommendationService = new RecommendationService();
