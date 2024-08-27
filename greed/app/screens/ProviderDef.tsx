import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, TextInput } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
// import { setLocation } from '../store/authSlice'; 
// import { Image } from '../assets/uranProv.png';
import { locations } from '../../components/locations';
import { login } from '../../store/authSlice';



const ProviderDef: React.FC = () => {
  





  return (

    <SafeAreaView style={styles.container}>
      
      <View style={styles.birds}>
        <Image 
        source={require('../../assets/birds.png')}
        style={styles.image}
      />
        <Text style={styles.text}>Définissez votre lieu</Text>
        <RNPickerSelect
          placeholder={{ label: 'Veuillez sélectionnez un lieu...', value: null }}
          items={locations}
          // onValueChange={(value) => setSelectedLocation(value as string)}
          style={pickerStyles}
        />
        <TextInput
        placeholder='Entrez le nom de votre établissement'
        style={styles.input}
        />
        <Image
        source={require('../../assets/uranProv.png')}
        style={styles.image}
      />
 
      </View>

      <TouchableOpacity style={styles.button} >
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
  input: {
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'normal',
    color: 'black',
    marginBottom: 20,
    // right: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  birds: {
    marginBottom: 90,
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    top: 1,
  },
  image: {
    width: 317,
    height: 291,
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
    alignSelf: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: '80%',
    marginBottom: 20,
  },
  inputAndroid: {
   alignSelf: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: '80%',
    marginBottom: 20,
  },
};

export default ProviderDef;
