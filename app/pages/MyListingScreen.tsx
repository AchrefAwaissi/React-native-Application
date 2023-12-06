import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, Switch } from 'react-native';
import colors from '../config/colors';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, onSnapshot, where, doc, deleteDoc } from '@firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../config/config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const MyListingScreen = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Vérifiez si l'utilisateur est connecté
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      console.log("UserID:", userId);

      const q = query(collection(db, "products"), where("userId", "==", userId));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const productList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productList);
        console.log("Produits:", productList);
      }, (error) => {
        console.error("Erreur lors de la récupération des produits :", error);
      });

      return () => unsubscribe();
    } else {
      console.log("Aucun utilisateur connecté");
    }
  }, []);

  const deleteProduct = async (productId) => {
    // Supprimer de Firebase
    try {
      await deleteDoc(doc(db, "products", productId));
      console.log("Produit supprimé:", productId);

      // Mettre à jour l'état local
      setProducts(currentProducts => currentProducts.filter(product => product.id !== productId));
    } catch (error) {
      console.error("Erreur lors de la suppression du produit:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Switch 
        onValueChange={() => deleteProduct(item.id)} 
        value={false} 
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
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

export default MyListingScreen;
