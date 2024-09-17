import React, { useState, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, Alert, Text, View, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker, Callout, Circle } from 'react-native-maps';
import { getDirections, Directions } from './directionsService';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

const MapComponent = () => {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState({
    latitude: 36.8065,
    longitude: 10.1815,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [route, setRoute] = useState<Directions | null>(null);
  const [mapType, setMapType] = useState('standard');
  const [showTraffic, setShowTraffic] = useState(false);
  const [showPOIs, setShowPOIs] = useState([
    { latlng: { latitude: 36.8008, longitude: 10.1800 }, title: "Medina of Tunis", description: "UNESCO World Heritage site" },
    { latlng: { latitude: 36.8186, longitude: 10.1658 }, title: "Bardo National Museum", description: "Famous museum with Roman mosaics" },
  ]);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    const fetchDirections = async () => {
      try {
        const origin = 'Tunis, Tunisia';
        const destination = 'Sousse, Tunisia';
        
        const directions = await getDirections(origin, destination);
        setRoute(directions);
        
        if (directions.points.length > 0) {
          const { latitude, longitude } = directions.points[0];
          setRegion(prev => ({
            ...prev,
            latitude,
            longitude,
          }));
        }
      } catch (error) {
        console.error("Error fetching directions:", error);
        Alert.alert("Error", "Failed to fetch directions.");
      }
    };

    fetchDirections();
  }, []);

  const toggleMapType = () => {
    setMapType(prev => prev === 'standard' ? 'satellite' : 'standard');
  };

  const toggleTraffic = () => {
    setShowTraffic(prev => !prev);
  };

  const zoomToFit = () => {
    if (route && mapRef.current) {
      mapRef.current.fitToCoordinates(route.points, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Error', 'Failed to get current location');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        mapType={mapType}
        showsTraffic={showTraffic}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        showsBuildings={true}
        showsIndoors={true}
      >
        {route && (
          <>
            <Polyline
              coordinates={route.points}
              strokeColor="#FF0000"
              strokeWidth={3}
            />
            <Marker
              coordinate={route.points[0]}
              title="Start"
              description="Starting point"
            >
              <Callout>
                <Text>Start of the route</Text>
              </Callout>
            </Marker>
            <Marker
              coordinate={route.points[route.points.length - 1]}
              title="End"
              description="Destination"
            >
              <Callout>
                <Text>End of the route</Text>
              </Callout>
            </Marker>
          </>
        )}
        {showPOIs.map((poi, index) => (
          <Marker
            key={index}
            coordinate={poi.latlng}
            title={poi.title}
            description={poi.description}
          >
            <Callout>
              <Text>{poi.title}</Text>
              <Text>{poi.description}</Text>
            </Callout>
          </Marker>
        ))}
        <Circle
          center={{ latitude: 36.8065, longitude: 10.1815 }}
          radius={1000}
          fillColor="rgba(0, 0, 255, 0.1)"
          strokeColor="rgba(0, 0, 255, 0.5)"
        />
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
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
        <TouchableOpacity style={styles.button} onPress={toggleMapType}>
          <MaterialIcons name="layers" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleTraffic}>
          <MaterialIcons name="traffic" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={zoomToFit}>
          <MaterialIcons name="zoom-out-map" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={getCurrentLocation}>
          <MaterialIcons name="my-location" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {route && (
        <View style={styles.infoBox}>
          <Text>Distance: {route.distance}</Text>
          <Text>Duration: {route.duration}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height * 0.75,
  },
  infoBox: {
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  buttonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'column',
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
});

export default MapComponent;