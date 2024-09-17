import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

const ProfileScreen = () => {
  const dispatch = useDispatch();

  const handleLogOut = async () => {
    try {
      dispatch(logout());
      console.log('User logged out');
    } catch (error) {
      console.error('Error during logout:', error);
    }
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
          style={styles.input}
          placeholder="Nom d'utilisateur"
        />
        <TextInput
          style={styles.input}
          placeholder="E-Mail"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Téléphone"
          keyboardType="phone-pad"
        />
      </View>

      {/* Update Button */}
      <TouchableOpacity style={styles.updateButton}>
        <Text style={styles.updateButtonText}>Mettre à jour</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  logoutIcon: {
    alignSelf: 'flex-end',
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