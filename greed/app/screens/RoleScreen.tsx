import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useDispatch } from 'react-redux';
import { setRole } from '../../store/authSlice';

const RoleScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params as { userId: string };
  const [isProviderChecked, setIsProviderChecked] = useState<boolean>(false);
  const [isCollecteurChecked, setIsCollecteurChecked] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) {
      console.error('User ID is not available');
    }
  }, [userId]);

  const handleRoleSelection = async () => {
    const role = isProviderChecked ? 'Provider' : isCollecteurChecked ? 'Collecteur' : '';

    if (!role) {
      Alert.alert('Erreur', 'Veuillez sélectionner votre rôle.');
      return;
    }

    try {
      if (!userId) {
        throw new Error('User ID is not available');
      }

      await setDoc(doc(db, 'users', userId), { role }, { merge: true });
      dispatch(setRole(role));
      navigation.navigate(role === 'Provider' ? 'ProviderDef' : 'CollectorDef'); // Navigate to a common screen
    } catch (error) {
      console.error('Error updating role:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour du rôle.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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