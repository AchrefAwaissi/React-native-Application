import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Modal, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../config/colors';
import LocMap from './Map';
import { RouteProp } from '@react-navigation/native';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, deleteDoc } from "@firebase/firestore";
import { firebaseConfig } from "../config/config";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

type ScreenProductDetailsProps = {
  route: RouteProp<RootStackParamList, 'ScreenProductDetails'>;
  navigation: StackNavigationProp<RootStackParamList, 'ScreenProductDetails'>;
};

const ScreenProductDetails: React.FC<ScreenProductDetailsProps> = ({ route, navigation }) => {
  const { product } = route.params;
  const [modalVisible, setModalVisible] = useState(false);

  const handlePurchase = async (product: any) => {
    // logique achat d'un produit
    console.log('Achat du produit :', product);

    try {
      const { id, longitude, latitude, ...productWithoutLocation } = product;

      const newSoldProductRef = await addDoc(collection(db, 'sold_products'), {
        ...productWithoutLocation,
      });

      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.error('Erreur lors de la copie du produit dans sold_products :', error);
    }
  };

  const handleMessage = (product: any) => {
    navigation.navigate('SendMessageScreen', { product });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image source={{ uri: product.imageUri }} style={styles.image} />
        </TouchableOpacity>
        <View style={styles.detailsContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{product.title}</Text>
            <View style={styles.viewsContainer}>
              <Icon name="eye" size={20} color="black" />
              <Text style={styles.viewCount}>{product.views}12</Text>
            </View>
          </View>
          <Text style={styles.price}>{product.price}€</Text>
          <Text style={styles.description}>{product.description}</Text>
          <View style={styles.publisherSection}>
            <Text style={styles.description}>Publié le: {product.publishedAt}</Text>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.buyButton} onPress={() => handlePurchase(product)}>
              <View style={styles.buttonContent}>
                <Text style={styles.buyButtonText}>Achat</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.messageButton} onPress={() => handleMessage(product)}>
              <Icon name="envelope" size={20} color="white" style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.fullScreenContainer}>
          <Image source={{ uri: product.imageUri }} style={styles.fullScreenImage} />
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Icon name="times" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
      <LocMap productId={product.id} />
    </ScrollView>
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
    borderColor: 'gray',
    borderWidth: 0.4,
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
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.secondary,
    paddingBottom:7,
  },
  description: {
    fontSize: 14,
    color: 'gray',
    paddingBottom:7,
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
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 30,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buyButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
   
  },
  messageButton: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  icon: {
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCount: {
    marginLeft: 5, 

  },
});

export default ScreenProductDetails;