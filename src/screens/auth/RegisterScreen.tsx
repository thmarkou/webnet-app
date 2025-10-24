import React from 'react';
import { useRoute } from '@react-navigation/native';
import UserRegistrationForm from './UserRegistrationForm';
import ProfessionalRegistrationForm from './ProfessionalRegistrationForm';

export default function RegisterScreen() {
  const route = useRoute();
  const { role } = route.params as { role: 'user' | 'professional' };

  return role === 'user' ? <UserRegistrationForm /> : <ProfessionalRegistrationForm />;
}

