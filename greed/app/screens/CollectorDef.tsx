import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, Modal, FlatList, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { locations } from '../../components/locations';
import { login } from '../../store/authSlice';

const CollectorDef: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();

  const handleLocationSelection = async () => {
    if (selectedLocation) {
      try {
        const user = getAuth().currentUser;
        if (user) {
          await setDoc(doc(db, 'users', user.uid), {
            location: selectedLocation,
          }, { merge: true });

          Alert.alert('Success', 'Location saved successfully');
          
          // Dispatch actions
          dispatch(login());
        }
      } catch (error) {
        console.error('Error saving location:', error);
        Alert.alert('Error', 'Failed to save location');
      }
    } else {
      Alert.alert('Veuillez sélectionner un lieu.');
    }
  };

  const renderLocationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.locationItem}
      onPress={() => {
        setSelectedLocation(item.value);
        setModalVisible(false);
      }}
    >
      <Text style={styles.locationText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContainer}>
        <Text style={styles.text}>Définissez votre lieu</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.dropdownText}>
            {selectedLocation ? locations.find(loc => loc.value === selectedLocation)?.label : 'Sélectionnez un lieu...'}
          </Text>
        </TouchableOpacity>
        <Image source={require('../../assets/uranCollector.png')} style={styles.image} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLocationSelection}>
        <Text style={styles.buttonText}>Confirmer</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={locations}
              renderItem={renderLocationItem}
              keyExtractor={(item) => item.value}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  image: {
    marginTop: 20,
    width: 380,
    height: 500,
    borderRadius: 25,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'green',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  dropdown: {
    alignSelf: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: '80%',
    marginBottom: 20,
  },
  dropdownText: {
    color: 'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  locationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  locationText: {
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CollectorDef;