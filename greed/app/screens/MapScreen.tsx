import React, { useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import MapView, { Region } from 'react-native-maps';

export default function MapScreen() {
  const initialRegion = {
    latitude: 33.8869, // Latitude for the center of Tunisia
    longitude: 9.5375, // Longitude for the center of Tunisia
    latitudeDelta: 5.0, // Adjusted to show the whole country
    longitudeDelta: 5.0, // Adjusted to show the whole country
  };

  const [region, setRegion] = useState<Region>(initialRegion);

  const zoomIn = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta / 2,
      longitudeDelta: region.longitudeDelta / 2,
    });
  };
  const zoomOut = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta * 2,
      longitudeDelta: region.longitudeDelta * 2,
    });
  };
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      />
      <View style={styles.buttonContainer}>
        <Button title="Zoom In" onPress={zoomIn} />
        <Button title="Zoom Out" onPress={zoomOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 0.5, // 50% of the screen height
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});