// import React from 'react';
// import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
// import { useRoute } from '@react-navigation/native';

// const Home = () => {
//   const route = useRoute();
//   const { newProduct } = route.params || {};
//   const products = newProduct ? [newProduct] : [];

//   return (
//     <View style={styles.container}>
//       <Text>Bienvenue sur la page d'accueil</Text>
//       <FlatList
//         data={products}
//         keyExtractor={(item) => item.title}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <Image source={{ uri: item.imageUri }} style={styles.image} />
//             <Text style={styles.title}>{item.title}</Text>
//             <Text style={styles.description}>{item.description}</Text>

//             {/* the person's name */}
//             <View style={styles.publisherSection}>
//               <Text style={styles.publisherText}>{`Published by: ${item.publisher}`}</Text>
//             </View>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   card: {
//     marginBottom: 16,
//     borderColor: 'gray',
//     borderWidth: 1,
//     padding: 8,
//   },
//   image: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//     marginBottom: 8,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   description: {
//     fontSize: 14,
//   },
//   publisherSection: {
//     marginTop: 10,
//   },
//   publisherText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default Home;





// import React from 'react';
// import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
// import { useRoute, RouteProp } from '@react-navigation/native';
// interface Product {
//     title: string;
//     description: string;
//     imageUri: string;
//     publisher:string;
//   }
// // Define the type for your route parameters
// type HomeScreenRouteProp = RouteProp<{ Home: { newProduct: Product } }, 'Home'>;

// const Home = () => {
//   const route = useRoute<HomeScreenRouteProp>();
//   const { newProduct } = route.params || {};
//   const products = newProduct ? [newProduct] : [];

//   return (
//     <View style={styles.container}>
//       <Text>Bienvenue sur la page d'accueil</Text>
//       <FlatList
//         data={products}
//         keyExtractor={(item) => item.title}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <Image source={{ uri: item.imageUri }} style={styles.image} />
//             <Text style={styles.title}>{item.title}</Text>
//             <Text style={styles.description}>{item.description}</Text>

//             {/* the person's name */}
//             <View style={styles.publisherSection}>
//               <Text style={styles.publisherText}>{`Published by: ${item.publisher}`}</Text>
//             </View>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   card: {
//     marginBottom: 16,
//     borderColor: 'gray',
//     borderWidth: 1,
//     padding: 8,
//   },
//   image: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//     marginBottom: 8,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   description: {
//     fontSize: 14,
//   },
//   publisherSection: {
//     marginTop: 10,
//   },
//   publisherText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default Home;




import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';

interface Product {
  title: string;
  description: string;
  imageUri: string;
  publisher: string;
}

// Define the type for your route parameters
type HomeScreenRouteProp = RouteProp<{ Home: { newProduct: Product } }, 'Home'>;

const Home = () => {
  const route = useRoute<HomeScreenRouteProp>();
  const { newProduct } = route.params as { newProduct?: Product } || {};
  const products = newProduct ? [newProduct] : [];

  return (
    <View style={styles.container}>
      <Text>Bienvenue sur la page d'accueil</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imageUri }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>

            {/* the person's name */}
            <View style={styles.publisherSection}>
              <Text style={styles.publisherText}>{`Published by: ${item.publisher}`}</Text>
            </View>
          </View>
        )}
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
    marginBottom: 16,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
  },
  publisherSection: {
    marginTop: 10,
  },
  publisherText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;
