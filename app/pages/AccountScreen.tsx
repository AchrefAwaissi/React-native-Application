import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Table, Row, Rows } from 'react-native-table-component';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, DocumentData, where, query } from '@firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { firebaseConfig } from '../config/config';

interface UserData {
  nom: string;
  prenom: string;
  email: string;
  adresse: string;
}

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
        <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
          <Row data={['Field', 'Value']} style={styles.head} textStyle={styles.text} />
          <Rows
            data={[
              ['Nom', userData.nom],
              ['Prénom', userData.prenom],
              ['Email', userData.email],
              ['Adresse', userData.adresse],
            ]}
            textStyle={styles.text}
          />
        </Table>
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
    backgroundColor: '#fff' },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 20 },
  head: { 
    height: 40, 
    backgroundColor: '#f1f8ff' },
  text: { 
    margin: 6 },
});
