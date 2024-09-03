import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useDispatch } from 'react-redux';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { signInSuccess, setRole } from '../../store/authSlice'; // Import the necessary actions

const ProviderLocationScreen: React.FC = ({ route }) => {
  const { location: initialLocation } = route.params;
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const dispatch = useDispatch();
  const userId = getAuth().currentUser?.uid;

  const handleSaveLocation = async () => {
    if (location && userId) {
      try {
        await setDoc(doc(db, 'users', userId), {
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        }, { merge: true });
        Alert.alert('Success', 'Location saved successfully');
        
        // Log the user in
        const user = getAuth().currentUser;
        dispatch(signInSuccess({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }));
        dispatch(setRole('Provider')); // Assuming the role is 'Provider'
      } catch (error) {
        console.error('Error saving location:', error);
        Alert.alert('Error', 'Failed to save location');
      }
    } else {
      Alert.alert('Error', 'Please select a location');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Mark Your Place of Work</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={(e) => setLocation(e.nativeEvent.coordinate)}
      >
        {location && (
          <Marker
            coordinate={location}
            title="Your Work Location"
          />
        )}
      </MapView>
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveLocation}>
        <Text style={styles.saveButtonText}>Save Location</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  map: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ProviderLocationScreen;
