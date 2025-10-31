/**
 * Admin Authentication Modal
 * Prompts for admin code before sensitive operations
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { verifyAdminCode } from '../services/auth/adminAuth';

interface AdminAuthModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  message?: string;
}

export default function AdminAuthModal({
  visible,
  onClose,
  onSuccess,
  title = 'Admin Authentication',
  message = 'Παρακαλώ εισάγετε τον admin κωδικό:'
}: AdminAuthModalProps) {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (!code.trim()) {
      Alert.alert('Σφάλμα', 'Παρακαλώ εισάγετε τον admin κωδικό');
      return;
    }

    setIsVerifying(true);
    try {
      const isValid = await verifyAdminCode(code.trim());
      if (isValid) {
        setCode('');
        onSuccess();
        onClose();
      } else {
        Alert.alert('Σφάλμα', 'Λάθος admin κωδικός');
      }
    } catch (error) {
      Alert.alert('Σφάλμα', 'Σφάλμα κατά την επαλήθευση');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Admin Κωδικός"
            value={code}
            onChangeText={setCode}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={isVerifying}
            >
              <Text style={styles.cancelButtonText}>Ακύρωση</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.verifyButton]}
              onPress={handleVerify}
              disabled={isVerifying}
            >
              <Text style={styles.verifyButtonText}>
                {isVerifying ? 'Επαλήθευση...' : 'Επαλήθευση'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 25,
    width: '85%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  verifyButton: {
    backgroundColor: '#007AFF',
    marginLeft: 10,
  },
  verifyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

