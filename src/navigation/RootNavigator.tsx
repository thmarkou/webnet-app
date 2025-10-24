import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { useAuthStore } from '../store/auth/authStore';

// Auth Screens
import PreSignUpScreen from '../screens/auth/PreSignUpScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ProfessionalRegistrationForm from '../screens/auth/ProfessionalRegistrationForm';

// App Screens
import HomeScreen from '../screens/app/HomeScreen';
import ProfileScreen from '../screens/app/ProfileScreen';
import AppointmentsListScreen from '../screens/app/AppointmentsListScreen';
import ProfessionalDetailsScreen from '../screens/app/ProfessionalDetailsScreen';
import BookAppointmentScreen from '../screens/app/BookAppointmentScreen';
import AddReviewScreen from '../screens/app/AddReviewScreen';
import ChatScreen from '../screens/app/ChatScreen';
import ProfessionalProfileScreen from '../screens/app/ProfessionalProfileScreen';
import UserNotificationsScreen from '../screens/app/UserNotificationsScreen';
import ProfessionalNotificationsScreen from '../screens/app/ProfessionalNotificationsScreen';
import RateProfessionalScreen from '../screens/app/RateProfessionalScreen';
import UpdateServiceDetailsScreen from '../screens/app/UpdateServiceDetailsScreen';
import DatabaseManagementScreen from '../screens/app/DatabaseManagementScreen';
import AdminDashboardScreen from '../screens/app/AdminDashboardScreen';
import FindProfessionalsScreen from '../screens/app/FindProfessionalsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingBottom: 15,
          paddingTop: 5,
          height: 70,
          marginBottom: 10,
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Φόρτωση...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Auth Stack
        <>
          <Stack.Screen name="PreSignUp" component={PreSignUpScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      ) : (
        // Main App Stack
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen 
            name="AppointmentsList" 
            component={AppointmentsListScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="ProfessionalDetails" 
            component={ProfessionalDetailsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="BookAppointment" 
            component={BookAppointmentScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="AddReview" 
            component={AddReviewScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Chat" 
            component={ChatScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="ProfessionalProfile" 
            component={ProfessionalProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="UserNotifications" 
            component={UserNotificationsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="ProfessionalNotifications" 
            component={ProfessionalNotificationsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="RateProfessional" 
            component={RateProfessionalScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="UpdateServiceDetails" 
            component={UpdateServiceDetailsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="DatabaseManagement" 
            component={DatabaseManagementScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="AdminDashboard" 
            component={AdminDashboardScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="FindProfessionals" 
            component={FindProfessionalsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="ProfessionalRegistration" 
            component={ProfessionalRegistrationForm}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
