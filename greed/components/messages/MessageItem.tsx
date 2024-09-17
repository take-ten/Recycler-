import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const MessageItem = ({ provider, message, isCurrentUser, avatarUrl, timestamp }) => {
  // console.log('MessageItem rendered:', { provider, message, isCurrentUser, timestamp });
  return (
    <View style={[styles.messageContainer, isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer]}>
      {!isCurrentUser && <Image source={{ uri: avatarUrl }} style={styles.avatar} />}
      <View style={[styles.messageBubble, isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble]}>
        <Text style={styles.providerText}>{provider}</Text>
        {message.startsWith('data:image/') ? (
          <Image source={{ uri: message }} style={styles.messageImage} />
        ) : (
          <Text style={styles.messageText}>{message}</Text>
        )}
        <Text style={styles.timestamp}>{new Date(timestamp.seconds * 1000).toLocaleTimeString()}</Text>
      </View>
      {isCurrentUser && <Image source={{ uri: avatarUrl }} style={styles.avatar} />}
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    backgroundColor: '#f1f1f1',
  },
  currentUserContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  otherUserContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  currentUserBubble: {
    backgroundColor: '#d0f0c0',
  },
  otherUserBubble: {
    backgroundColor: '#f1f1f1',
  },
  providerText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  timestamp: {
    fontSize: 12,
    color: 'grey',
    marginTop: 5,
  },
});

export default MessageItem;