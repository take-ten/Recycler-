import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Avatar } from 'react-native-elements';

const { width, height } = Dimensions.get('window');

const MapComponent = () => {
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 36.8065, // Latitude for Tunis, Tunisia
        longitude: 10.1815, // Longitude for Tunis, Tunisia
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {/* Polyline */}
      <Polyline
        coordinates={[
          { latitude: 36.8065, longitude: 10.1815 },
          { latitude: 36.8075, longitude: 10.1825 },
          { latitude: 36.8085, longitude: 10.1835 },
        ]}
        strokeColor="#00FF00"
        strokeWidth={6}
      />
      {/* Markers */}
      <Marker coordinate={{ latitude: 36.8065, longitude: 10.1815 }} pinColor="green" />
      <Marker coordinate={{ latitude: 36.8085, longitude: 10.1835 }}>
        <Avatar
          rounded
          source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
          size="small"
        />
      </Marker>
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: width,
    height: height * 0.75,
  },
});

export default MapComponent;