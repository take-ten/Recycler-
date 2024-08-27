import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';
// import { setLocation } from '../store/authSlice';
import { locations } from '../../components/locations';




const CollectorDef: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const dispatch = useDispatch();
// meme soucis que le provider ..

// a conntinuer avec skander pour eviter les erreurs et regler setLocation dans l'authActions


  

  const handleLocationSelection = () => {
    if (selectedLocation) {
      // dispatch(setLocation(selectedLocation)); 
      dispatch(login());
    } else {
      alert('Veuillez sélectionner un lieu.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContainer}>
        <Text style={styles.text}>Définissez votre lieu</Text>
        <RNPickerSelect
          placeholder={{ label: 'Sélectionnez un lieu...', value: null }}
          items={locations}
          onValueChange={(value) => setSelectedLocation(value as string)}
          style={pickerStyles}
        />
        <Image source={require('../../assets/uranCollector.png')} style={styles.image} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLocationSelection}>
        <Text style={styles.buttonText}>Confirmer</Text>
      </TouchableOpacity>
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
    marginTop : 20,
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
});

const pickerStyles = {
  inputIOS: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: '80%',
    marginBottom: 20,
  },
  inputAndroid: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: '80%',
    marginBottom: 20,
  },
};

export default CollectorDef;
