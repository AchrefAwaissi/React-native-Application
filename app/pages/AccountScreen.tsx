import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, where, query, updateDoc, doc } from '@firebase/firestore';
import { getAuth, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { firebaseConfig } from '../config/config';
import ProfileScreen from './ProfileScreen';
import { getStorage, ref, uploadString, getDownloadURL, uploadBytes } from 'firebase/storage';


interface UserData {
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
            
            // Update user data with the new photo URL
            if (user.photoURL !== data.photoURL) {
              await updateProfile(user, { photoURL: data.photoURL });
            }
  
            setUserData(data);
            setImage(user.photoURL); // Set the profile picture URL
          }
        } catch (error) {
          console.error('Error fetching data from Firebase:', error);
        }
      } else {
        setUserData(null);
        setImage(null); // Clear the profile picture URL when user logs out
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  const handleSignOut = async () => {
    const auth = getAuth();

    try {
      await signOut(auth);

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
  
        // Upload image to Firebase Storage
        await uploadBytes(storageRef, blob);
  
        // Get download URL and update user profile in Firestore
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
          <Text style={styles.userInfo}>{`Nom: ${userData.nom}`}</Text>
          <Text style={styles.userInfo}>{`Prénom: ${userData.prenom}`}</Text>
          <Text style={styles.userInfo}>{`Email: ${userData.email}`}</Text>
          <Text style={styles.userInfo}>{`Adresse: ${userData.adresse}`}</Text>
        </View>
      )}
      <Button title="Sign Out" onPress={handleSignOut} />
      <ProfileScreen></ProfileScreen>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    borderRadius: 100,
    overflow: 'hidden',
    borderColor: 'black',
    borderWidth: 2,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userInfo: {
    fontSize: 16,
    marginTop: 5,
  },
});
 