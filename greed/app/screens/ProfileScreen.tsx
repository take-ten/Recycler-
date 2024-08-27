import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice'
// import { handleLogout } from '../store/authActions';



const ProfileScreen = () => {
  const dispatch = useDispatch();

  const handleLogOut = () => {

    dispatch(logout());
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Logout Icon */}
      <TouchableOpacity style={styles.logoutIcon} onPress={handleLogOut}>
        <Ionicons name="log-out-outline" size={30} color="black" />
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.header}>Profile :</Text>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="E-Mail ou Tel"
          style={styles.input}
        />
        <TextInput
          placeholder="Mot de passe"
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          placeholder="Veuillez confirmer votre mot de passe"
          secureTextEntry
          style={styles.input}
        />
      </View>

      {/* Update Button */}
      <TouchableOpacity style={[styles.updateButton, { marginTop: 40 }]}>
        <Text style={styles.updateButtonText}>Mettre à jour</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  logoutIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    
  },
  inputContainer: {
    marginBottom: 20,
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
  updateButton: {
    backgroundColor: 'green',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;