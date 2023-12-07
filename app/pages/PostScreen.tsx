import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TextInput, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, updateDoc } from "@firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { firebaseConfig } from "../config/config";
import { LatLngLiteral } from "leaflet";
import * as Location from "expo-location";

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

const PostScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [price, setPrice] = useState(""); // Added for price
  const [image, setImage] = useState("");
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [ownPosition, setOwnPosition] = useState<null | LatLngLiteral>(null);

  useEffect(() => {
    const getLocationAsync = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.warn("Permission to access location was denied");
        }

        let location = await Location.getCurrentPositionAsync({});
        console.log("Lat:", location.coords.latitude, "Long:", location.coords.longitude);

        if (!ownPosition) {
          setOwnPosition({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          setLatitude(location.coords.latitude.toString());
          setLongitude(location.coords.longitude.toString());
        }
      } catch (error) {
        console.error("Error getting location:", error);
      }
    };

    getLocationAsync().catch((error) => {
      console.error("Error getting location:", error);
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      } catch (error) {
        console.error("Error requesting camera permissions:", error);
      }
    })();
  }, []);

  const handleChooseImage = async () => {
    try {
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
    } catch (error) {
      console.error("Error choosing image:", error);
    }
  };

  const handlePublish = async () => {
    try {
      if (!title || !description || !image || !price) {
        console.warn("Please fill in all required fields.");
        return;
      }

      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

      const newProduct = {
        title,
        description,
        price: price !== "" ? parseFloat(price) : null,
        latitude: latitude !== "" ? parseFloat(latitude) : null,
        longitude: longitude !== "" ? parseFloat(longitude) : null,
        userId: auth.currentUser?.uid,
        publishedAt: formattedDate,
      };

      const docRef = await addDoc(
        collection(firestore, "products"),
        newProduct
      );
      console.log("Document added with ID: ", docRef.id);

      const imageRef = ref(storage, `product_images/${docRef.id}`);
      await uploadBytes(imageRef, await fetch(image).then((res) => res.blob()));

      const imageUrl = await getDownloadURL(imageRef);

      await updateDoc(doc(firestore, "products", docRef.id), {
        imageUri: imageUrl,
        publishedAt: newProduct.publishedAt,
      });

      navigation.navigate("Home", { newProduct });
    } catch (error) {
      console.error("Error publishing:", error);
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
      <TextInput
        placeholder="Prix"
        value={price}
        onChangeText={(text) => setPrice(text)}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Choisir une image" onPress={handleChooseImage} />
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
      <Button
        title="Publier"
        onPress={handlePublish}
        disabled={!title || !description || !image || !price}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
});

export default PostScreen;
 