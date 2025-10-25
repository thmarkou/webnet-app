export interface ProfessionalRecommendation {
  id: string;
  recommenderId: string; // User who made the recommendation
  recommenderName: string;
  professionalId: string;
  professionalName: string;
  profession: string;
  city: string;
  rating: number;
  reason?: string; // Why they recommend this professional
  createdAt: Date;
  isActive: boolean;
}

export interface FriendRecommendation {
  friendId: string;
  friendName: string;
  recommendations: ProfessionalRecommendation[];
}

export interface RecommendationStats {
  totalRecommendations: number;
  recommendationsByCategory: { [category: string]: number };
  topRecommenders: { userId: string; name: string; count: number }[];
}
