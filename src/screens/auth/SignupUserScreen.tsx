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

export type SignupUserStackParamList = any;

type Props = NativeStackScreenProps<SignupUserStackParamList, 'SignupUser'>;

export const SignupUserScreen: React.FC<Props> = ({ navigation }) => {
  const { signupWithRole } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!firstName || !email || !password) {
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
        role: 'USER',
        name: `${firstName} ${lastName}`.trim(),
        email,
        password,
        profileExtras: {
          firstName,
          lastName,
          dob,
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
        <Text style={styles.heading}>Signing Up as User</Text>
        <Text style={styles.subheading}>
          Already have an account?
          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
            {' '}
            Log In
          </Text>
        </Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="First name"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Last name"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

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
            placeholder="Date of birth (DD/MM/YYYY)"
            value={dob}
            onChangeText={setDob}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone number"
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
            <Text style={styles.primaryButtonText}>{loading ? 'Creating...' : 'Sign Up'}</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.googleButton}>
            <Text style={styles.googleText}>Sign up with Google</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F2FF' },
  scrollInner: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  heading: { fontSize: 24, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  subheading: { fontSize: 13, color: '#E0DEFF', marginBottom: 12 },
  link: { color: '#FFFFFF', textDecorationLine: 'underline' },
  card: {
    marginTop: 16,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
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
  halfInput: {
    flex: 1,
    marginRight: 8,
  },
  primaryButton: {
    backgroundColor: '#7B5CFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16 },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  divider: { flex: 1, height: 1, backgroundColor: '#E5E5F0' },
  dividerText: {
    marginHorizontal: 8,
    fontSize: 12,
    color: '#999',
  },
  googleButton: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E1EE',
    backgroundColor: '#FFFFFF',
  },
  googleText: { fontSize: 14, color: '#444' },
  error: { color: 'red', marginBottom: 8, fontSize: 13 },
});
