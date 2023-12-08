import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../config/colors';

const OfflineNotice = () => {
  const [isConnected, setIsConnected] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (isConnected === null) {
    return null;
  }

  if (!isConnected) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineText}>You are offline</Text>
        </View>
      </SafeAreaView>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#b52424',
  },
  offlineContainer: {
    backgroundColor: '#b52424',
    padding: 10,
  },
  offlineText: {
    color: colors.white,
  },
});

export default OfflineNotice;
