import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const About = () => {
  const contactInfo = 'Your contact info here';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>About Us</Text>
      <View style={styles.qrContainer}>
        <QRCode
          value={contactInfo}
          size={200}
        />
      </View>
      <Text style={styles.contactText}>Contact:</Text>
      <Text style={styles.infoText}>TEL: +21695169311</Text>
      <Text style={styles.infoText}>TEL: +21653140677</Text>
      <Text 
        style={styles.linkText}
        onPress={() => Linking.openURL('http://www.GorillazBrews.com')}
      >
        www.GorillazBrews.com
      </Text>
      <Text style={styles.infoText}>GorillazTeam@Gorillaz.com</Text>
      <View style={styles.bottomNav}>
        {/* Add your bottom navigation components here */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white', // Changed from '#f0f0f0' to 'white'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  contactText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  linkText: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 5,
  },
});

export default About;
