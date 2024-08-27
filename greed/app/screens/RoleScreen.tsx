import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector
import { login } from '../store/authSlice';


const RoleScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isProviderChecked, setIsProviderChecked] = useState<boolean>(false);
  const [isCollecteurChecked, setIsCollecteurChecked] = useState<boolean>(false);
  const dispatch = useDispatch();

  // Check if user is logged in
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Accessing the authentication state

  const handleRoleSelection = () => {
    const role = isProviderChecked ? 'Provider' : isCollecteurChecked ? 'Collecteur' : '';
    
    if (role === '') {
      Alert.alert('Erreur', 'Veuillez sélectionner votre rôle.');
      return;
    }

    // dispatch(login(role)); // Dispatch login action

    if (role === 'Provider') {
      navigation.navigate('ProviderDef',{role:role});
    } else {
      navigation.navigate('CollectorDef',{role:role});                         // soit on passe le Role comme props , soit par Redux ( a voir avec skander )
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Centered text and checkboxes */}
      <View style={styles.centerContainer}>
        <Text style={styles.text}>Vous êtes ?</Text>
        <View style={styles.checkboxContainer}>
          <CheckBox
            title="Provider"
            checked={isProviderChecked}
            onPress={() => {
              setIsProviderChecked(true);
              setIsCollecteurChecked(false);
            }}
            containerStyle={styles.checkbox}
            textStyle={styles.checkboxText}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checkedColor="black"
          />
          <CheckBox
            title="Collecteur"
            checked={isCollecteurChecked}
            onPress={() => {
              setIsCollecteurChecked(true);
              setIsProviderChecked(false);
            }}
            containerStyle={styles.checkbox}
            textStyle={styles.checkboxText}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checkedColor="black"
          />
        </View>
      </View>

      {/* Bottom button */}
      <TouchableOpacity style={styles.button} onPress={handleRoleSelection}>
        <Text style={styles.buttonText}>Suivant</Text>
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
  checkboxContainer: {
    width: '80%',
  },
  checkbox: {
    backgroundColor: 'white',
    borderWidth: 0,
    padding: 0,
    margin: 0,
  },
  checkboxText: {
    fontSize: 18,
    fontWeight: 'normal',
    color: 'black',
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

export default RoleScreen;