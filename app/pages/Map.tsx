import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import MapView, { Circle } from 'react-native-maps';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDoc, doc } from '@firebase/firestore';
import { firebaseConfig } from '../config/config';
import { LatLngLiteral } from 'leaflet';

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const initialRegion = {
  latitude: 44.837789,
  longitude: -0.57918,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const LocMap = ({ productId }) => {
  const [region, setRegion] = useState(initialRegion);
  const [productCoords, setProductCoords] = useState<null | LatLngLiteral>(null);

  const fetchProductCoordsFromFirebase = async () => {
    try {
      const selectedProductId = productId;
      const productDoc = await getDoc(doc(collection(firestore, 'products'), selectedProductId));
      const productData = productDoc.data();

      if (productData !== undefined && productData !== null) {
        setProductCoords({
          latitude: productData.latitude,
          longitude: productData.longitude,
        });
      }
    } catch (error) {
      console.error('Error fetching product coordinates:', error);
    }
  };

  useEffect(() => {
    fetchProductCoordsFromFirebase();
  }, []);

  useEffect(() => {
    if (productCoords) {
      setRegion({
        latitude: productCoords.latitude,
        longitude: productCoords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }
  }, [productCoords]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
        >
          {productCoords && (
            <Circle
              radius={200}
              fillColor='rgba(52, 152, 219, 0.1)'
              strokeColor='blue'
              center={{
                latitude: productCoords.latitude,
                longitude: productCoords.longitude,
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
  mapContainer: {
    height: 200, // Set a fixed height for the map container
  },
  map: {
    flex: 1,
  },
});

export default LocMap;
