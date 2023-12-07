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
  publishedAt: string;
  userName?: string; 
}

type HomeScreenRouteProp = RouteProp<{ Home: { newProduct: Product } }, "Home">;

const Home = () => {
  const route = useRoute<HomeScreenRouteProp>();
  const navigation = useNavigation();
  const { newProduct } = (route.params as { newProduct?: Product }) || {};
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsQuerySnapshot = await getDocs(collection(firestore, "products"));
      const productsData: Product[] = productsQuerySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        price: doc.data().price,
        description: doc.data().description,
        imageUri: doc.data().imageUri,
        publisher: doc.data().publisher,
        userId: doc.data().userId,
        publishedAt: doc.data().publishedAt,
        userName: doc.data().userName,
      }));

      setProducts(productsData);
    };

    const fetchUsers = async () => {
      const usersQuerySnapshot = await getDocs(collection(firestore, "Utilisateurs"));
      const usersData = usersQuerySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(usersData);
    };

    fetchProducts();
    fetchUsers();
  }, [newProduct]);

  const getUserData = (userId: string) => {
    const user = users.find((user) => user.id === userId);
    return user ? `${user.nom} ${user.prenom}` : "Unknown User";
  };

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
                <Text style={styles.publisher}>Publié le: {item.publishedAt}</Text>
                <Text style={styles.publisher}>Par: {getUserData(item.userId)}</Text>
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
    backgroundColor: '#FFFFFF', 
    marginBottom: 20,
    borderColor: "gray",
    borderWidth: 0.4,
    shadowColor: 'rgba(99, 99, 99, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5, 
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
    paddingBottom:7,
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
    paddingBottom:7,
  },  
});
export default Home;
