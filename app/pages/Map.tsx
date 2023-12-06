import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import MapView, { Circle } from 'react-native-maps';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDoc, doc } from '@firebase/firestore';
import { firebaseConfig } from '../config/config';

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const initialRegion = {
  latitude: 44.837789,
  longitude: -0.57918,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const LocMap = () => {
  const [region, setRegion] = useState(initialRegion);
  const [productCoords, setProductCoords] = useState(null);

  useEffect(() => {
    // Replace the following code with your Firebase logic to fetch product coordinates
    const fetchProductCoordsFromFirebase = async () => {
      try {
        const productId = 'DyAgVniZenCWHt6ZKlc4'
        const productDoc = await getDoc(doc(collection(firestore, 'products'), productId))
        const productData = productDoc.data();

        console.log('Product Data:', productData);
        
        if (productData && productData.coordinates) {
            setProductCoords(productData.coordinates);
            setRegion({
              latitude: productData.latitude,
              longitude: productData.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
            
          }
        } catch (error) {
          console.error('Error fetching product coordinates:', error);
        }
      };
  

    fetchProductCoordsFromFirebase();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          region={region}
          onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
        >
          {productCoords && (
            <Circle
              radius={200}
              fillColor='rgba(52, 152, 219, 0.1)'
              strokeColor='blue'
              center={{
                latitude: productCoords[0],
                longitude: productCoords[1],
              }}
            />
          )}
        </MapView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LocMap;