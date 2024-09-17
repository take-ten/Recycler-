import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const MapProvider: React.FC = () => {
  const [location, setLocation] = useState({
    latitude: 34.0,
    longitude: 9.0,
    latitudeDelta: 5,
    longitudeDelta: 5,
  });
  const [address, setAddress] = useState('');

  const handleSubmit = () => {

    

    


    // Implement logic to save the location and address
    //assuming we have a function to save the location and address
    //we will use the location and address to save the location and address
    


    console.log('Saving location:',location);
    console.log('Saving address:', address);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Veuillez préciser le lieu de votre établissement en Tunisie :</Text>
      </View>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={location}
        onRegionChangeComplete={setLocation}
        minZoomLevel={5}
        maxZoomLevel={15}
        initialRegion={{
          latitude: 34.0,
          longitude: 9.0,
          latitudeDelta: 5,
          longitudeDelta: 5,
        }}
      >
        <Marker coordinate={location} />
      </MapView>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Entrez l'adresse"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enregistrer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
  },
  input: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MapProvider;
