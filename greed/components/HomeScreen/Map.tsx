import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Avatar } from 'react-native-elements';
import Geolocation from 'react-native-geolocation-service';

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
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission denied');
          return;
        }
      }
      Geolocation.getCurrentPosition(
        (position) => {
          setRegion({
            ...region,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
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
});

export default MapComponent;