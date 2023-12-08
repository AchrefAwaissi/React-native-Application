import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, where, query } from '@firebase/firestore';
import { getAuth, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { firebaseConfig } from '../config/config';
import ProfileScreen from './ProfileScreen';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';


interface UserData {
  photoURL: string | null;
  nom: string;
  prenom: string;
  email: string; 
  adresse: string;
}

const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth();
    const storage = getStorage(app);

export default function AccountScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth();
  
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const usersRef = collection(db, 'Utilisateurs');
        const userQuery = query(usersRef, where('email', '==', user.email));
  
        try {
          const querySnapshot = await getDocs(userQuery);
  
          if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data() as UserData;
            
            if (user.photoURL !== data.photoURL) {
              await updateProfile(user, { photoURL: data.photoURL });
            }
  
            setUserData(data);
            setImage(user.photoURL); 
          }
        } catch (error) {
          console.error('Error fetching data from Firebase:', error);
        }
      } else {
        setUserData(null);
        setImage(null); 
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  const handleSignOut = async () => {
    const auth = getAuth();

    try {
      signOut(auth);
      navigation.navigate("Welcome")
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleChooseImage = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user) {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });
  
      if (!result.canceled) {
        const selectedImage = result.uri;
        const storageRef = ref(storage, `profile_images/${user.uid}`);
        const response = await fetch(selectedImage);
        const blob = await response.blob();
  
      
        await uploadBytes(storageRef, blob);
  
     
        const downloadURL = await getDownloadURL(storageRef);
        updateProfile(user, { photoURL: downloadURL });
  
        setImage(selectedImage);
      } else {
        alert("Vous n'avez pas sélectionné d'image.");
      }
    }
  };  
  
  

  return (
    <View style={styles.container}>
    {userData && (
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={handleChooseImage} style={styles.profileImageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profileImage} />
          ) : (
            <Text style={styles.profileImagePlaceholder}>Select Image</Text>
          )}
        </TouchableOpacity>
        <View style={styles.userInfoRow}>
          <Text style={styles.userInfoTitle}>Nom:</Text>
          <Text style={styles.userInfo}>{userData.nom}</Text>
        </View>
        <View style={styles.userInfoRow}>
          <Text style={styles.userInfoTitle}>Prénom:</Text>
          <Text style={styles.userInfo}>{userData.prenom}</Text>
        </View>
        <View style={styles.userInfoRow}>
          <Text style={styles.userInfoTitle}>Email:</Text>
          <Text style={styles.userInfo}>{userData.email}</Text>
        </View>
        <View style={styles.userInfoRow}>
          <Text style={styles.userInfoTitle}>Adresse:</Text>
          <Text style={styles.userInfo}>{userData.adresse}</Text>
        </View>
      </View>
    )}
 <ProfileScreen></ProfileScreen>
 <Button title="Sign Out" onPress={handleSignOut} />
  </View>
 );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#f0f0f0',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#ffffff', 
    borderRadius: 10,
    padding: 10,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  profileImageContainer: {
    borderRadius: 100,
    overflow: 'hidden',
    borderColor: '#4ecdc4',
    borderWidth: 4,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  profileImagePlaceholder: {
    fontSize: 16,
    color: 'gray',
  },
  userInfo: {
    fontSize: 16,
    marginTop: 5,
    fontWeight: '500',
    color: '#333', 
  },  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  userInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
});