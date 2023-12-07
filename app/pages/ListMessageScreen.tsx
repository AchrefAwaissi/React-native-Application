
import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import colors from '../config/colors';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, onSnapshot, where, doc, deleteDoc } from '@firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../config/config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const MyListMessageScreen = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      console.log("UserID:", userId);

      // Fetching both sent and received messages
      const messagesRef = collection(db, "messages");
      const sentMessagesQuery = query(messagesRef, where("senderId", "==", userId));
      const receivedMessagesQuery = query(messagesRef, where("receiverId", "==", userId));
      
      const unsubscribeSentMessages = onSnapshot(sentMessagesQuery, (querySnapshot) => {
        const sentMessages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Sent Messages:", sentMessages);
        setMessages(prevMessages => [...prevMessages, ...sentMessages]);
      }, (error) => {
        console.error("Error fetching sent messages:", error);
      });

      const unsubscribeReceivedMessages = onSnapshot(receivedMessagesQuery, (querySnapshot) => {
        const receivedMessages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Received Messages:", receivedMessages);
        setMessages(prevMessages => [...prevMessages, ...receivedMessages]);
      }, (error) => {
        console.error("Error fetching received messages:", error);
      });

      return () => {
        unsubscribeSentMessages();
        unsubscribeReceivedMessages();
      };
    } else {
      console.log("Aucun utilisateur connecté");
      setMessages([]); // Clear messages if no user is logged in
    }
  }, []);

  const deleteMessage = async (messageId) => {
    try {
      await deleteDoc(doc(db, "messages", messageId));
      console.log("Message supprimé:", messageId);
      setMessages(currentMessages => currentMessages.filter(message => message.id !== messageId));
    } catch (error) {
      console.error("Erreur lors de la suppression du message:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title || 'No Title'}</Text>
      <Text style={styles.description}>{item.message || 'No Content'}</Text>
      <TouchableOpacity onPress={() => deleteMessage(item.id)}>
        <AntDesign name="delete" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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
    backgroundColor: colors.white,
    marginBottom: 20,
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
});

export default MyListMessageScreen;
