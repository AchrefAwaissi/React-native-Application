import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import { useNavigation} from '@react-navigation/native';

const navigation = useNavigation();

const ViewImageScreen = ({route}) => {
 const {imageUrl} = route.params;

 const handleCloseImage = () => {
    navigation.navigate('ProductDetailsScreen' as never);
 };

 return (
    <View style={styles.container}>
      <Image source={{uri: imageUrl}} style={styles.image} />

      <TouchableOpacity onPress={handleCloseImage} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
    </View>
 );
};

const styles = StyleSheet.create({
 container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
 },
 image: {
    width: '100%',
    height: '100%',
 },
 closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 50,
 },
 closeButtonText: {
    color: 'white',
    fontSize: 24,
 },
});

export default ViewImageScreen;