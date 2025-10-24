import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Auth Stack Navigator
export type AuthStackParamList = {
  PreSignUp: undefined;
  Login: undefined;
  Register: { role: 'user' | 'professional' };
  ForgotPassword: undefined;
};

// Main App Stack Navigator
export type MainStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  AppointmentsList: undefined;
  ProfessionalDetails: { professionalId: string };
  BookAppointment: { professionalId: string };
  AddReview: { appointmentId: string };
};

// Main Tab Navigator
export type MainTabParamList = {
  Home: undefined;
  Appointments: undefined;
  Search: undefined;
  Notifications: undefined;
  Friends: undefined;
  Profile: undefined;
};

// Root Navigator
export type RootStackParamList = AuthStackParamList & MainStackParamList;

// Screen Props Types
export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<AuthStackParamList, T>;
export type MainScreenProps<T extends keyof MainStackParamList> = NativeStackScreenProps<MainStackParamList, T>;
export type TabScreenProps<T extends keyof MainTabParamList> = BottomTabScreenProps<MainTabParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
