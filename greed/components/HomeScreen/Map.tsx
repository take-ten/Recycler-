import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Platform } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Avatar } from 'react-native-elements';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

const MapComponent = () => {
  const [region, setRegion] = useState({
    latitude: 36.8065,
    longitude: 10.1815,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        ...region,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    requestLocationPermission();
  }, []);

  return (
    <MapView
      provider={PROVIDER_GOOGLE} // Use Google Maps
      style={styles.map}
      showsUserLocation={true}
      showsMyLocationButton={true}
      region={region}
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
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
  },
});

export default MapComponent;