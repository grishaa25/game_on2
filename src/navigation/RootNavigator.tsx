import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupUserScreen } from '../screens/auth/SignupUserScreen';
import { SignupHostScreen } from '../screens/auth/SignupHostScreen';
import { HostOnboardingNavigator } from './HostOnboardingNavigator';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const PlaceholderScreen = ({ title }: { title: string }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>{title}</Text>
  </View>
);

const WelcomeScreen = () => <PlaceholderScreen title="Welcome" />;
const SignupTypeScreen = () => <PlaceholderScreen title="Signup Type" />;
const CreateProfileScreen = () => <PlaceholderScreen title="Create Profile" />;

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignupType" component={SignupTypeScreen} />
    <Stack.Screen name="SignupUser" component={SignupUserScreen} />
    <Stack.Screen name="SignupHost" component={SignupHostScreen} />
    <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
  </Stack.Navigator>
);

const UserTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Book" children={() => <PlaceholderScreen title="Book (User Home)" />} />
    <Tab.Screen name="Connect" children={() => <PlaceholderScreen title="Connect" />} />
    <Tab.Screen name="Messages" children={() => <PlaceholderScreen title="Messages" />} />
    <Tab.Screen name="Profile" children={() => <PlaceholderScreen title="User Profile" />} />
  </Tab.Navigator>
);

const HostTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Slots" children={() => <PlaceholderScreen title="Manage Slots" />} />
    <Tab.Screen name="History" children={() => <PlaceholderScreen title="Host Booking History" />} />
    <Tab.Screen name="HostProfile" children={() => <PlaceholderScreen title="Host Profile" />} />
  </Tab.Navigator>
);

export const RootNavigator = () => {
  const { firebaseUser, role, hasVenue, loading } = useAuth();

  if (loading) {
    return (
      <NavigationContainer>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {!firebaseUser || !role ? (
        <AuthStack />
      ) : role === 'HOST' && !hasVenue ? (
        <HostOnboardingNavigator />
      ) : role === 'USER' ? (
        <UserTabs />
      ) : (
        <HostTabs />
      )}
    </NavigationContainer>
  );
};
