import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert,Image } from 'react-native';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "@firebase/firestore";
import { firebaseConfig } from "../config/config";
import AppButton from '../components/AppButton';

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

const SendMessageScreen = ({ route }: { route: { params: { product: any } } }) => {
  const { product } = route.params;
  const [message, setMessage] = useState('');
  const receiverId = product.userId;
  const senderId = auth.currentUser?.uid;

  const handleSendMessage = async (product: any) => {
    if (message.trim() === '') {
      Alert.alert("Error", "Message is empty");
      return;
    }

    try {
      const messageDocRef = await addDoc(collection(firestore, 'messages'), {
        destinataire: receiverId,
        message,
        expediteur: senderId
      });

      setMessage('');
      Alert.alert("Success", "Message sent with document ID: " + messageDocRef.id);
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message");
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require("../assets/welcome.png")}/>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message here..."
          value={message}
          onChangeText={setMessage}
        />
       <AppButton
    title="Send Message"
    onPress={handleSendMessage}
  />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "white",
  },
  inputContainer: {
    padding: 20,
    width: "100%",
    alignItems: "center",
  },
  logo: {
    width: 340, 
    height: 300, 
  },
  logoContainer: {
    position: "absolute",
    top: 70,
    alignItems: "center",
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#4ecdc4',
    borderWidth: 1,
    borderRadius: 25,
    width: '90%',
    padding: 15,
    marginBottom: 10,
    marginVertical: 10,
  },
});

export default SendMessageScreen;
