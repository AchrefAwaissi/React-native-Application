import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from '@firebase/firestore';
import { firebaseConfig } from '../config/config';

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
 
const PostScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
 
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
 
  const handleChooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
 
    if (!result.canceled) {
      const selectedImage = result.assets[0];
      setImage(selectedImage.uri);
    } else {
      alert("Vous n'avez pas sélectionné d'image.");
    }
  };
 
  const handleTakePhoto = async () => {
    if (hasPermission) {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });
 
      if (!result.canceled) {
        const takenImage = result.assets[0];
        setImage(takenImage.uri);
      }
    } else {
      alert("Permission to use camera denied");
    }
  };
 
  const handlePublish = async () => {
    try {
      const newProduct = { title, description, imageUri: image };
  
      // Add a document to the "products" collection
      const docRef = await addDoc(collection(firestore, 'products'), newProduct);
  
      console.log('Document added with ID: ', docRef.id);
      navigation.navigate('Home', { newProduct });
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };
 
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Publier un produit</Text>
      <TextInput
        placeholder="Titre"
        value={title}
        onChangeText={(text) => setTitle(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={(text) => setDescription(text)}
        style={styles.input}
      />
      <Button title="Choisir une image" onPress={handleChooseImage} />
      <Button title="Prendre une photo" onPress={handleTakePhoto} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <Button title="Publier" onPress={handlePublish} />
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
});
 
export default PostScreen;