import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Assurez-vous d'avoir installé cette bibliothèque
import colors from '../config/colors';

const ScreenProductDetails = ({ route }) => {
  const { product } = route.params;
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image source={{ uri: product.imageUri }} style={styles.image} />
        </TouchableOpacity>
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <View style={styles.publisherSection}>
            <Text style={styles.publisherText}>Publisher: {product.publisher}</Text>
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
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Icon name="times" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
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
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.secondary,
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
});

export default ScreenProductDetails;
