import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "../config/config";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

interface Message {
  expediteur: string;
  message: string;
  key: string;
}

const ListMessageScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!auth.currentUser) {
      console.log("No user logged in");
      return;
    }
    
    const currentUserId = auth.currentUser.uid;
    const messagesQuery = query(
      collection(firestore, "messages"),
      where("destinataire", "==", currentUserId)
    );

    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const messagesArray: Message[] = [];
      querySnapshot.forEach((doc) => {
        messagesArray.push({ ...doc.data(), key: doc.id } as Message);
      });
      setMessages(messagesArray);
    });

    return () => unsubscribe(); // Detach listener on unmount
  }, []);

  const handleReply = () => {
    // Logique pour répondre au message
    console.log('Répondre au message');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity style={styles.replyBubble} onPress={handleReply}>
              <Text style={styles.replyText}>Répondre</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{item.expediteur}</Text>
            <Text style={styles.description}>{item.message}</Text>
          </View>
        )}
        keyExtractor={item => item.key}
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
    backgroundColor: 'white',
    marginBottom: 20,
    padding: 20,
    borderRadius: 10,
    position: 'relative',
  },
  replyBubble: {
    backgroundColor: '#fc5c65',
    position: 'absolute',
    top: 0,
    right: 0, 
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    zIndex: 1,
  },
  replyText: {
    color: 'white',
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 7,
  },
  description: {
    fontSize: 16,
    color: 'grey',
  },
});

export default ListMessageScreen;
