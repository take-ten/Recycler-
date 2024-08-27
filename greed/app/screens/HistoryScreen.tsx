import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import MessageItem from '../../components/messages/MessageItem';

const messages = [
  { id: '1', provider: 'Provider 1', message: "je suis en route , j'arrive dans une h.." },
  { id: '2', provider: 'Provider 3', message: "j'ai pris le package , au revoir !!" },
  { id: '3', provider: 'Provider 2', message: "Normalement, c'est mon collegue q.." },
  { id: '4', provider: 'Provider 8', message: "Merci ,a tte !!" },
];

const MessageScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Messagerie</Text>
      <FlatList
        data={messages}
        renderItem={({ item }) => <MessageItem provider={item.provider} message={item.message} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
  },
  list: {
    paddingBottom: 20,
  },
});

export default MessageScreen;