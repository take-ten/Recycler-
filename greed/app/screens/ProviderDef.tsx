import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, TextInput, Modal, FlatList, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setRole } from '../../store/authSlice';
import { locations } from '../../components/locations';

const ProviderDef: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params as { userId: string };
  const dispatch = useDispatch();

  const handleConfirm = async () => {
    if (selectedLocation) {
      const location = locations.find(loc => loc.value === selectedLocation);
      if (location) {
        try {
          dispatch(setRole('Provider'));
          navigation.navigate('ProviderLocation', { userId, location });
        } catch (error) {
          Alert.alert('Erreur', error.message);
        }
      } else {
        alert('Invalid location selected.');
      }
    } else {
      alert('Veuillez sélectionner un lieu.');
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
      <View style={styles.birds}>
        <Image 
          source={require('../../assets/birds.png')}
          style={styles.image}
        />
        <Text style={styles.text}>Définissez votre lieu</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.dropdownText}>
            {selectedLocation ? locations.find(loc => loc.value === selectedLocation)?.label : 'Veuillez sélectionnez un lieu...'}
          </Text>
        </TouchableOpacity>
        <TextInput
          placeholder='Entrez le nom de votre établissement'
          style={styles.input}
        />
        <Image
          source={require('../../assets/uranProv.png')}
          style={styles.image}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
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
  birds: {
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  dropdown: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dropdownText: {
    fontSize: 16,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    backgroundColor: 'green',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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

export default ProviderDef;
