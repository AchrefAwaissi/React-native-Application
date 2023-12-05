import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, where, query } from '@firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { firebaseConfig } from '../config/config';

interface UserData {
  nom: string;
  prenom: string;
  email: string;
  adresse: string;
}

const FieldItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default function AccountScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const usersRef = collection(db, 'Utilisateurs');
        const userQuery = query(usersRef, where('email', '==', user.email));

        getDocs(userQuery)
          .then((querySnapshot) => {
            const data: UserData | null = querySnapshot.empty
              ? null
              : (querySnapshot.docs[0].data() as UserData);
            setUserData(data);
          })
          .catch((error) => {
            console.error('Error fetching data from Firebase:', error);
          });
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const auth = getAuth();

    try {
      await signOut(auth);
      // Navigate to WelcomeScreen after signing out
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Information</Text>
      {userData && (
        <FlatList
          data={[
            { label: 'Nom', value: userData.nom },
            { label: 'Prénom', value: userData.prenom },
            { label: 'Email', value: userData.email },
            { label: 'Adresse', value: userData.adresse },
          ]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <FieldItem label={item.label} value={item.value} />}
        />
      )}
      <Button title="Sign Out" onPress={handleSignOut} />
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  fieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold', 
    marginRight: 10,
  },
  value: {},
});
