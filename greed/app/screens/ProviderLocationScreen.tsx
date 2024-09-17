import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useDispatch } from 'react-redux';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { getAuth, signInWithCredential } from 'firebase/auth';
import { signInSuccess, setRole, setUserId } from '../../store/authSlice';

const ProviderLocationScreen: React.FC = ({ route }) => {
  const { location: initialLocation, userId } = route.params;
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // Simulate a loading effect
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust the timeout as needed

    return () => clearTimeout(timer);
  }, []);

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
        if (user) {
          // Dispatch only serializable data
          dispatch(signInSuccess({
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL
          }));
          dispatch(setUserId(user.uid));
        }

        dispatch(setRole('Provider'));
      } catch (error) {
        console.error('Error saving location:', error);
        Alert.alert('Error', 'Failed to save location');
      }
    } else {
      Alert.alert('Error', 'Please select a location');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
