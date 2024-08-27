import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import MapComponent from '../../components/HomeScreen/Map';
import BottomSheet from '../../components/HomeScreen/BottomSheet';


const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <MapComponent />
      <BottomSheet />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default HomeScreen;