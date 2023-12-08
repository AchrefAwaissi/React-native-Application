import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import colors from '../config/colors';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, onSnapshot, where, doc, deleteDoc } from '@firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../config/config';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const MyListingScreen = () => {
 const [products, setProducts] = useState([]);

 useEffect(() => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;

      const q = query(collection(db, "products"), where("userId", "==", userId));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const productList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productList);
      }, (error) => {
        console.error("Erreur lors de la récupération des produits :", error);
      });

      return () => unsubscribe();
    } else {
      console.log("Aucun utilisateur connecté");
    }
 }, []);

 const deleteProduct = async (productId: string) => {
    try {
      await deleteDoc(doc(db, "products", productId));

      setProducts(currentProducts => currentProducts.filter(product => product.id !== productId));
    } catch (error) {
      console.error("Erreur lors de la suppression du produit:", error);
    }
 };

 const renderItem = ({ item }: { item: {
   price: string; id: string, title: string, description: string 
} }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.price}€</Text>
      <TouchableOpacity onPress={() => deleteProduct(item.id)}>
        <AntDesign name="delete" size={24} color={colors.primary} />
      </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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