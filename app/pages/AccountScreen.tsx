import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

const PostScreen = () => {
  const [image, setImage] = useState('');
  const [hasPermission, setHasPermission] = useState(null);

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

    if (!result.cancelled) {
      const selectedImage = result.uri;
      setImage(selectedImage);
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

      if (!result.cancelled) {
        const takenImage = result.uri;
        setImage(takenImage);
      }
    } else {
      alert("Permission to use camera denied");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={handleChooseImage} style={styles.profileImageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profileImage} />
          ) : (
            <Text style={styles.profileImagePlaceholder}>Select Image</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userInfo}>Email: john.doe@example.com</Text>
        <Text style={styles.userInfo}>Address: 123 Main Street</Text>
      </View>
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
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    borderRadius: 100, // pour obtenir une forme de cercle
    overflow: 'hidden',
    borderColor: 'black',
    borderWidth: 2,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  profileImagePlaceholder: {
    fontSize: 16,
    color: 'gray',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  userInfo: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default PostScreen;
 