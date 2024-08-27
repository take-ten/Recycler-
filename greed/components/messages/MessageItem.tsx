import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements';

const MessageItem = ({ provider, message }) => {
  return (
    <View style={styles.container}>
      <Avatar
        rounded
        size="medium"
        containerStyle={styles.avatar}
        source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
      />
      <View style={styles.textContainer}>
        <Text style={styles.providerText}>{provider}</Text>
        <Text style={styles.messageText}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  avatar: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  providerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 14,
    color: '#555',
  },
});

export default MessageItem;