import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// We are not strictly typing the navigator param list here to keep setup simple.
type Props = NativeStackScreenProps<any>;

export const HostLocationPermissionScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.title}>What's your location?</Text>
        <Text style={styles.subtitle}>
          Please share your location to see available sport venues nearby, or enter it manually.
        </Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          // TODO: integrate real location permission + map
          onPress={() => navigation.navigate('HostOtp')}
        >
          <Text style={styles.primaryText}>Allow location access</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('HostLocationManual')}
        >
          <Text style={styles.secondaryText}>Enter location manually</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'space-between' },
  top: { marginTop: 40 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#666' },
  buttons: { marginBottom: 40 },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: { backgroundColor: '#7B5CFF' },
  primaryText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  secondaryButton: { borderWidth: 1, borderColor: '#7B5CFF', backgroundColor: '#fff' },
  secondaryText: { color: '#7B5CFF', fontWeight: '600', fontSize: 16 },
});
