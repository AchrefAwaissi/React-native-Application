
import React from 'react';
import { StyleSheet, View, FlatList, Image, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { firebaseConfig } from "../config/config";
import { getAuth, signOut } from "firebase/auth";


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const ProfileScreen = () => {
  const navigation = useNavigation();
  const menuItems = [
    {
      title: "My Listings",
      iconUri: require("../assets/list.png"), 
      targetScreen: 'MyListingScreen' 
    },
    {
      title: "My Messages",
      iconUri: require("../assets/messenger.png"),
      targetScreen: 'ListMessageScreen' 
    },
    {
      title: "My Purchase",
      iconUri: require("../assets/button.png"),
      targetScreen: 'Welcome' 
    },
  ];

  const handleItemPress = (item: { title: any; iconUri?: any; targetScreen: any; }) => {
    if (item.targetScreen) {
      navigation.navigate(item.targetScreen as never);
    } else if (item.title === 'Sign Out') {
      handleSignOut();
    }
  };

  const handleSignOut = async () => {
    const auth = getAuth();

    try {
      signOut(auth);

    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <FlatList
          data={menuItems}
          keyExtractor={(menuItem) => menuItem.title}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleItemPress(item)}>
              <View style={styles.box}>
                <Image source={item.iconUri} style={styles.icon} />
                <Text style={styles.boxText}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    marginVertical: 20,
    marginHorizontal: 10,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignSelf: 'center',
    width: '98%',
    height: 80,
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(100, 100, 111, 0.2)',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.2,
    shadowRadius: 29,
    elevation: 5,
  },
  icon: {
    width: 45,
    height: 45,
    borderRadius: 20,
    marginRight: 15,
    objectFit: "cover"
  },
  boxText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default ProfileScreen;
