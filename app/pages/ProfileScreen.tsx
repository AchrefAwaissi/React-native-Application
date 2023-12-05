import React from 'react';
import { StyleSheet, View, FlatList, Image, Text } from 'react-native';

const ProfileScreen = () => {
  // Les couleurs pour les icônes peuvent toujours être utilisées si nécessaire
  const menuItems = [
    {
      title: "My Listings",
      iconUri: require("../assets/list.png"), // Remplacez par votre icône PNG
    },
    {
      title: "My Messages",
      iconUri: require("../assets/messenger.png"), // Remplacez par votre icône PNG
    },
    {
      title: "Sign Out",
      iconUri: require("../assets/log-out.png"), // Remplacez par votre icône PNG
    },
  ];

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <FlatList
          data={menuItems}
          keyExtractor={(menuItem) => menuItem.title}
          renderItem={({ item }) => (
            <View style={styles.box}>
              <Image source={item.iconUri} style={styles.icon} />
              <Text style={styles.boxText}>{item.title}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8f4f4', // Utiliser la couleur light directement ici
  },
  container: {
    marginVertical: 20,
    marginHorizontal: 10,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignSelf: 'center',
    width: '98%',
    height: 80,
    backgroundColor: '#ffffff', // Couleur blanche fixe pour toutes les boîtes
    shadowColor: 'rgba(100, 100, 111, 0.2)',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.2,
    shadowRadius: 29,
    elevation: 5,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  boxText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default ProfileScreen;
