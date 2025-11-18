import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';

export type SignupHostStackParamList = any;

type Props = NativeStackScreenProps<SignupHostStackParamList, 'SignupHost'>;

export const SignupHostScreen: React.FC<Props> = ({ navigation }) => {
  const { signupWithRole } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!name || !email || !password) {
      setError('Please fill name, email and password');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signupWithRole({
        role: 'HOST',
        name,
        email,
        password,
        profileExtras: {
          phone,
        },
      });
    } catch (e: any) {
      setError(e.message ?? 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollInner}>
        <Text style={styles.heading}>Signing Up as Host</Text>
        <Text style={styles.subheading}>
          Already have an account?
          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
            {' '}
            Log In
          </Text>
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Get Started</Text>
          <Text style={styles.cardSubtitle}>Enter your details to continue</Text>

          <TextInput
            style={styles.input}
            placeholder="Full name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Mobile number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm password"
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity style={styles.primaryButton} onPress={onSubmit} disabled={loading}>
            <Text style={styles.primaryButtonText}>{loading ? 'Creating...' : 'Continue'}</Text>
          </TouchableOpacity>

          <Text style={styles.terms}>
            By continuing, you accept our
            <Text style={styles.termsLink}> terms of service </Text>
            and
            <Text style={styles.termsLink}> privacy policy</Text>.
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>For an easy filling process</Text>
          <Text style={styles.infoSubtitle}>Please be ready with the following.</Text>
          <Text style={styles.infoItem}>• Venue permit copy</Text>
          <Text style={styles.infoItem}>• Bank details</Text>
          <Text style={styles.infoItem}>• GSTIN, if applicable</Text>
          <Text style={styles.infoItem}>• PAN card copy</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F2FF' },
  scrollInner: { paddingHorizontal: 24, paddingTop: 48, paddingBottom: 32 },
  heading: { fontSize: 24, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  subheading: { fontSize: 13, color: '#E0DEFF', marginBottom: 12 },
  link: { color: '#FFFFFF', textDecorationLine: 'underline' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4, color: '#111' },
  cardSubtitle: { fontSize: 13, color: '#77788A', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#E1E1EE',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: '#FAFAFF',
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: '#7B5CFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16 },
  terms: {
    fontSize: 11,
    color: '#888',
    marginTop: 8,
  },
  termsLink: {
    color: '#7B5CFF',
  },
  infoBox: {
    marginTop: 24,
    borderRadius: 18,
    backgroundColor: '#ECE9FF',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  infoTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2, color: '#333' },
  infoSubtitle: { fontSize: 12, color: '#555', marginBottom: 8 },
  infoItem: { fontSize: 12, color: '#444', marginBottom: 2 },
  error: { color: 'red', marginBottom: 8, fontSize: 13 },
});
