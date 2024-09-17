import React, { useState, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, Alert, Text, View, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { collection, onSnapshot, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { locations } from '../locations';

const { width, height } = Dimensions.get('window');

const MapComponent = ({ providerId }) => {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState({
    latitude: 36.8065,
    longitude: 10.1815,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [providers, setProviders] = useState([]);

  const currentUserId = getAuth().currentUser?.uid;

  useEffect(() => {
    const fetchCurrentUserLocation = async () => {
      if (!currentUserId) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUserId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.location) {
            const userLocation = locations.find(loc => loc.value === userData.location);
            if (userLocation) {
              setCurrentLocation(userLocation);
              setRegion({
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              });
            } else {
              Alert.alert('Error', 'User location not found in predefined locations.');
            }
          } else {
            Alert.alert('Error', 'User location not found.');
          }
        } else {
          Alert.alert('Error', 'User document not found.');
        }
      } catch (error) {
        console.error('Error fetching user location:', error);
        Alert.alert('Error', 'Failed to fetch user location.');
      }
    };

    fetchCurrentUserLocation();
  }, [currentUserId]);

  useEffect(() => {
    if (currentLocation) {
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'Provider'),
        where('location', '!=', null)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const providersList = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((provider) => {
            const distance = Math.sqrt(
              Math.pow(provider.location.latitude - currentLocation.latitude, 2) +
              Math.pow(provider.location.longitude - currentLocation.longitude, 2)
            );
            return distance < 0.1; // Filter providers within 0.1 degrees of latitude/longitude
          });
        setProviders(providersList);
      });

      return () => unsubscribe();
    }
  }, [currentLocation]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        showsBuildings={true}
        showsIndoors={true}
      >
        {providers.map((provider) => (
          <Marker
            key={provider.id}
            coordinate={provider.location}
            title={provider.displayName}
            description={provider.status}
          >
            <Callout>
              <Text>{provider.displayName}</Text>
              <Text>{provider.status}</Text>
            </Callout>
          </Marker>
        ))}
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="You are here"
            description="Your current location"
          >
            <Callout>
              <Text>Your current location</Text>
            </Callout>
          </Marker>
        )}
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => mapRef.current?.animateToRegion(region, 1000)}>
          <MaterialIcons name="my-location" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height * 0.75,
  },
  buttonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'column',
  },
  button: {
    backgroundColor: 'white',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
});

export default MapComponent;