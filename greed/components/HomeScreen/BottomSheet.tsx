import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Badge, Avatar } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const BottomSheet = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.bottomSheet}>
      <View style={styles.providerRow}>
        <Badge status="warning" containerStyle={styles.badge} />
        <Text style={styles.providerText}>Provider I</Text>
      </View>
      <View style={styles.providerRow}>
        <Badge status="success" containerStyle={styles.badge} />
        <Text style={styles.providerText}>Provider 2</Text>
        <Badge value="Active" status="success" containerStyle={styles.activeBadge} />
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="black" style={styles.messageIcon} onPress={() => navigation.navigate('ChatScreen')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: height * 0.25,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    marginRight: 10,
  },
  providerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeBadge: {
    marginLeft: 'auto',
    marginRight: 10,
  },
  messageIcon: {
    marginLeft: 10,
  },
});

export default BottomSheet;