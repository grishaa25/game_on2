import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HostLocationPermissionScreen } from '../screens/host/HostLocationPermissionScreen';
import { HostLocationManualScreen } from '../screens/host/HostLocationManualScreen';
import { HostOtpScreen } from '../screens/host/HostOtpScreen';
import { HostVenueInfoScreen } from '../screens/host/HostVenueInfoScreen';

const Stack = createNativeStackNavigator();

export const HostOnboardingNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HostLocationPermission"
        component={HostLocationPermissionScreen}
        options={{ title: 'What\'s your location?' }}
      />
      <Stack.Screen
        name="HostLocationManual"
        component={HostLocationManualScreen}
        options={{ title: 'Enter location manually' }}
      />
      <Stack.Screen
        name="HostOtp"
        component={HostOtpScreen}
        options={{ title: 'Verify phone' }}
      />
      <Stack.Screen
        name="HostVenueInfo"
        component={HostVenueInfoScreen}
        options={{ title: 'Venue information' }}
      />
    </Stack.Navigator>
  );
};
