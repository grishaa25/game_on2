import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';

// We keep navigation typing simple for now
export type AuthStackParamList = any;

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);
    if (!email || !password) {
      setError('Please fill both email and password');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e: any) {
      setError(e.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Log in</Text>
        <Text style={styles.subtitle}>Let\'s login into your GameOn account</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Username/Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#C0C0CF"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor="#C0C0CF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity style={styles.primaryButton} onPress={onSubmit} disabled={loading}>
            <Text style={styles.primaryButtonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forgotContainer}
            onPress={() => {
              // TODO: hook forgot password flow
            }}
          >
            <Text style={styles.forgotText}>Forgot Password ?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don\'t have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignupUser')}>
            <Text style={styles.footerLink}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F7FD' },
  inner: { flex: 1, paddingHorizontal: 24, paddingTop: 64 },
  title: { fontSize: 30, fontWeight: '700', marginBottom: 8, color: '#111' },
  subtitle: { fontSize: 14, color: '#7B7B8A', marginBottom: 24 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  label: { fontSize: 13, color: '#77788A', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#E1E1EE',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 14,
    backgroundColor: '#FAFAFF',
  },
  primaryButton: {
    backgroundColor: '#7B5CFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16 },
  forgotContainer: { marginTop: 12, alignItems: 'center' },
  forgotText: { color: '#7B5CFF', fontSize: 13 },
  error: { color: 'red', marginBottom: 8, fontSize: 13 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: { color: '#7B7B8A', fontSize: 13 },
  footerLink: { color: '#7B5CFF', fontSize: 13, fontWeight: '600' },
});
