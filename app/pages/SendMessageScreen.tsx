import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "@firebase/firestore";
import { firebaseConfig } from "../config/config";

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
      console.log('receiverId:', receiverId);
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
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type your message here..."
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send Message" onPress={handleSendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    width: '80%',
    marginBottom: 10,
  },
});

export default SendMessageScreen;