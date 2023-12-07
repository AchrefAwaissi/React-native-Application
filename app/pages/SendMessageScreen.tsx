// import React, { useState } from 'react';
// import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

// const SendMessageScreen = ({ route }) => {
//   const [message, setMessage] = useState('');
//   const receiverId = route.params?.userId;

//   const handleSendMessage = () => {
//     if (!receiverId) {
//       console.error("UserId not provided");
//       return;
//     }

//     if (message.trim() === '') {
//       console.error("Message is empty");
//       return;
//     }

//     // Here you would add the logic to send the message
//     console.log(`Sending message to userId ${receiverId}: ${message}`);
//     // Reset the message input
//     setMessage('');
//   };

//   return (
//     <View style={styles.container}>
//       <Text>Send Message to User ID: {receiverId}</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Type your message here..."
//         value={message}
//         onChangeText={setMessage}
//       />
//       <Button title="Send Message" onPress={handleSendMessage} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: 'gray',
//     borderRadius: 5,
//     padding: 10,
//     width: '80%',
//     marginBottom: 10,
//   },
// });

// export default SendMessageScreen;

import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';

const SendMessageScreen = () => {
  const [message, setMessage] = useState('');
  // Hardcoded userId for demonstration
  const receiverId = "97q0Mw48oBWD4u6nhqJiyCJtdi22";

  const handleSendMessage = () => {
    if (message.trim() === '') {
      Alert.alert("Error", "Message is empty");
      return;
    }

    // Here, you would add the logic to send the message
    console.log(`Sending message to userId ${receiverId}: ${message}`);
    // Reset the message input
    setMessage('');
    // Display an alert or feedback to the user
    Alert.alert("Success", "Message sent");
  };

  return (
    <View style={styles.container}>
      <Text>Send Message to User ID: {receiverId}</Text>
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
