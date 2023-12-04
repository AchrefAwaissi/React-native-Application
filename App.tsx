// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';

import { AuthProvider, useAuth } from './app/pages/AuthContext';
import WelcomeScreen from './app/screens/WelcomeScreen';
import SignIn from './app/pages/SignIn';
import SignUp from './app/pages/SignUp';
import Profile from './app/pages/Profile';
import Home from './app/pages/Home';

// ... [import statements as before]

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignIn" component={SignIn}/>
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
}

const App = () => {
  const { isLoggedIn } = useAuth();

  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
