import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, Image } from 'react-native';
import colors from '../config/colors';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot } from '@firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../config/config';
 
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
 
const MyPurchaseScreen = () => {
  const [soldProducts, setSoldProducts] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    if (auth.currentUser) {
      const q = collection(db, 'sold_products');
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const productList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setSoldProducts(productList);
          setLoading(false); // Set loading to false once data is fetched
        },
        (error) => {
          console.error('Erreur lors de la récupération des produits :', error);
          setLoading(false); // Set loading to false in case of an error
        }
      );
 
      return () => unsubscribe();
    } else {
      console.log('Aucun utilisateur connecté');
    }
  }, []);
 
  const renderItem = ({ item }: { item: { price: string; id: string; title: string; description: string; imageUri: string } }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUri }} style={styles.productImage} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.price}€</Text>
    </View>
  );
 
  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text> // Display a loading indicator
      ) : soldProducts.length === 0 ? (
        <Text>No purchased products</Text> // Display a message when there are no sold products
      ) : (
        <FlatList data={soldProducts} renderItem={renderItem} keyExtractor={(item) => item.id} />
      )}
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: colors.white,
    marginBottom: 20,
    padding: 20,
    borderRadius: 10,
    flexDirection: 'column', // Adjusted to display image and text vertically
    alignItems: 'center', // Adjusted to center items horizontally
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 7,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.secondary,
  },
});
 
export default MyPurchaseScreen;