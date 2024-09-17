import React, { useState } from 'react';
import { View } from 'react-native';
import HistoryScreen from '../app/screens/HistoryScreen';
import ChatScreen from '../app/screens/ChatScreen';

const HistoryNavigation = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  return (
    <View style={{ flex: 1 }}>
      {selectedChatId ? (
        <ChatScreen chatId={selectedChatId} onBack={() => setSelectedChatId(null)} />
      ) : (
        <HistoryScreen onSelectChat={setSelectedChatId} />
      )}
    </View>
  );
};

export default HistoryNavigation;
