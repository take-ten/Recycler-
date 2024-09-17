import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import MapComponent from '../../components/HomeScreen/Map';
import BottomSheet from '../../components/HomeScreen/BottomSheet';

const HomeScreen = () => {
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

  const handleProviderSelect = (providerId: string) => {
    setSelectedProviderId(providerId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapComponent providerId={selectedProviderId} />
      <BottomSheet onProviderSelect={handleProviderSelect} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;