import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from 'react-native-vector-icons';
import { AuthProvider, useAuth } from './app/pages/AuthContext';
import WelcomeScreen from './app/screens/WelcomeScreen';
import SignIn from './app/pages/SignIn';
import SignUp from './app/pages/SignUp';
import Home from './app/pages/Home';
import PostScreen from './app/pages/PostScreen';
import AccountScreen from './app/pages/AccountScreen';
 import ScreenProductDetails from './app/pages/ScreenProductDetails';
import MyListingScreen from './app/pages/MyListingScreen';
import { Provider } from 'react-redux';
import { store } from './app/store/store';
import ListMessageScreen from './app/pages/ListMessageScreen';
import SendMessageScreen from './app/pages/SendMessageScreen';
import OfflineNotice from './app/notifications/OfflineNotice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
 
function ProfileTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      /> */}
            <Tab.Screen
        name="PostScreen"
        component={PostScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
 
function AppNavigator() {
  const { isLoggedIn } = useAuth();
 
  return (
    <Stack.Navigator>
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: true, headerTitle: 'Login' }} />
          <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: true, headerTitle: 'Register' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Back" component={ProfileTabs} options={{ headerShown: false }} />
          <Stack.Screen name="ScreenProductDetails" component={ScreenProductDetails} />
          <Stack.Screen name="MyListingScreen" component={MyListingScreen} />
          <Stack.Screen name="ListMessageScreen" component={ListMessageScreen} />
          <Stack.Screen name="SendMessageScreen" component={SendMessageScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
 
const App = () => {
  return (
    <Provider store={store}>
    <SafeAreaView style={styles.safeArea}>
      <AuthProvider>
        <OfflineNotice />
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaView>
  </Provider>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white', // Changez ceci selon la couleur de fond souhaitée pour votre application
  }
});
export default App;