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
  const { userId, googleCredential } = route.params as { userId: string, googleCredential: any };
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
      Alert.alert('Erreur', 'Veuillez sélectionner un rôle.');
      return;
    }

    try {
      await setDoc(doc(db, 'users', userId), { role }, { merge: true });
      dispatch(setRole(role));

      // Navigate to the appropriate screen based on the role
      if (role === 'Provider') {
        navigation.navigate('ProviderDef', { userId, googleCredential });
      } else if (role === 'Collecteur') {
        navigation.navigate('CollectorDef', { userId, googleCredential });
      }
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sélectionnez votre rôle</Text>
      <CheckBox
        title="Provider"
        checked={isProviderChecked}
        onPress={() => {
          setIsProviderChecked(true);
          setIsCollecteurChecked(false);
        }}
      />
      <CheckBox
        title="Collecteur"
        checked={isCollecteurChecked}
        onPress={() => {
          setIsProviderChecked(false);
          setIsCollecteurChecked(true);
        }}
      />
      <TouchableOpacity style={styles.button} onPress={handleRoleSelection}>
        <Text style={styles.buttonText}>Confirmer</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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

export default RoleScreen;