import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "@firebase/firestore";
import { firebaseConfig } from "../config/config";
import colors from "../config/colors";

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

interface Product {
  id: string;
  title: string;
  price: string;
  description: string;
  imageUri: string;
  publisher: string;
  userId: string;
}

type HomeScreenRouteProp = RouteProp<{ Home: { newProduct: Product } }, "Home">;

const Home = () => {
  const route = useRoute<HomeScreenRouteProp>();
  const navigation = useNavigation();
  const { newProduct } = (route.params as { newProduct?: Product }) || {};
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      // Assuming 'products' is the name of your Firestore collection
      const querySnapshot = await getDocs(collection(firestore, "products"));

      const productsData: Product[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(productsData);
    };

    fetchProducts();
  }, [newProduct]);

  const navigateToPostScreenDetails = (product: Product) => {
    navigation.navigate("ScreenProductDetails", { product });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToPostScreenDetails(item)}>
            <View style={styles.card}>
              <Image source={{ uri: item.imageUri }} style={styles.image} />
              <View style={styles.detailsContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.price}€</Text>
                <Text style={styles.publisher}>Publisher : {item.publisher}</Text>
              </View>
            </View>
          </TouchableOpacity>
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
    overflow: "hidden",
    borderRadius: 15,
    backgroundColor: colors.white,
    marginBottom: 20,
    borderColor: "gray",
    borderWidth: 0.4,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 7,
  },
  description: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.secondary,
  },
  publisherSection: {
    marginTop: 10,
  },
  publisherText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  detailsContainer: {
    padding: 20,
  },
  publisher: {
    fontSize: 14,
    color: 'gray',
  },  
});
export default Home;
