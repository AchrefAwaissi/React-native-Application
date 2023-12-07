// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, StyleSheet } from 'react-native';
// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, query, onSnapshot } from "firebase/firestore";
// import { firebaseConfig } from "../config/config";

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const firestore = getFirestore(app);

// interface Message {
//   expediteur: string;
//   message: string;
//   key: string;
// }

// const ListMessageScreen: React.FC = () => {
//   const [messages, setMessages] = useState<Message[]>([]);

//   useEffect(() => {
//     const q = query(collection(firestore, "messages"));

//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       const messagesArray: Message[] = [];
//       querySnapshot.forEach((doc) => {
//         messagesArray.push({ ...doc.data(), key: doc.id } as Message);
//       });
//       setMessages(messagesArray);
//     });

//     return () => unsubscribe(); // Detach listener on unmount
//   }, []);

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={messages}
//         renderItem={({ item }) => (
//           <Text style={styles.messageItem}>
//             {item.expediteur}: {item.message}
//           </Text>
//         )}
//         keyExtractor={item => item.key}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 22
//   },
//   messageItem: {
//     padding: 10,
//     fontSize: 18,
//     height: 44,
//   },
// });

// export default ListMessageScreen;



import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
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

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <Text style={styles.messageItem}>
            {item.expediteur}: {item.message}
          </Text>
        )}
        keyExtractor={item => item.key}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  },
  messageItem: {
    padding: 10,
    fontSize: 18,
    height: 44,
    //css
  },
});

export default ListMessageScreen;
