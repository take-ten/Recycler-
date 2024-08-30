import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignUp from '../app/screens/SignUp';
import Onboarding from '../app/screens/Onboarding';
import SignIn from '../app/screens/SignIn';
import RoleScreen from '../app/screens/RoleScreen';
import ProviderDef from '../app/screens/ProviderDef';
import CollectorDef from '../app/screens/CollectorDef';
import { useSelector } from 'react-redux';

const Stack = createStackNavigator();

const OnboardingNavigation = () => {
  const role = useSelector((state) => state.auth.role);

  return (
    <Stack.Navigator initialRouteName="Onboarding">
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="RoleScreen" component={RoleScreen} />
     <Stack.Screen name="ProviderDef" component={ProviderDef} />
      <Stack.Screen name="CollectorDef" component={CollectorDef} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigation;