import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../app/screens/HomeScreen';
import ChatScreen from '../app/screens/ChatScreen';
import ProviderDef from '../app/screens/ProviderDef';
import CollectorDef from '../app/screens/CollectorDef';
import HomeProvider from '../app/screens/HomeProvider';
import { useSelector } from 'react-redux';

const Stack = createStackNavigator();

const HomeStackNavigator = () => {
  const role: string | null = useSelector((state: any) => state.auth.role); // Updated to use 'auth' slice

  return (
    <Stack.Navigator initialRouteName={role === "Collector" ? "HomeScreen" : "HomeProvider"}>
      {role === "Provider" && <Stack.Screen name="HomeProvider" component={HomeProvider} />}
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="ProviderDef" component={ProviderDef} />
      <Stack.Screen name="CollectorDef" component={CollectorDef} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;