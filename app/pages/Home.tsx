import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import colors from '../config/colors';
 
interface Product {
  title: string;
  description: string;
  imageUri: string;
  publisher: string;
}
 
type HomeScreenRouteProp = RouteProp<{ Home: { newProduct: Product } }, 'Home'>;
 
const Home = () => {
  const route = useRoute<HomeScreenRouteProp>();
  const { newProduct } = route.params as { newProduct?: Product } || {};
  const products = newProduct ? [newProduct] : [];
 
  return (
    <View style={styles.container}>
      {/* <Text style={styles.heading}>Bienvenue sur la page d'accueil</Text> */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imageUri }} style={styles.image} />
            <View style={styles.detailsContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            </View>
            {/* <View style={styles.publisherSection}>
              <Text style={styles.publisherText}>{`Published by: ${item.publisher}`}</Text>
            </View> */}
          </View>
        )}
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
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
    borderRadius: 15,
    backgroundColor: colors.white,
    marginBottom: 20,
    borderColor:'gray',
    borderWidth:0.4,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 7,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    color:colors.secondary,
  },
  publisherSection: {
    marginTop: 10,
  },
  publisherText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsContainer: {
    padding: 20,
  },  
});
 
export default Home;