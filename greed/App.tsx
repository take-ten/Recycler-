import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import { StatusBar } from 'expo-status-bar';
import OnboardingNavigation from './navigation/OnboardingNavigation';
import { Provider } from 'react-redux';
import store from './store/store';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { login, setUserId, setRole } from './store/authSlice';

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}

const AppNavigator = () => {
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLoginState = async () => {
      const user = await AsyncStorage.getItem('user');
      const userId = await AsyncStorage.getItem('userId');
      const role = await AsyncStorage.getItem('role');
      if (user && userId && role) {
        dispatch(login(JSON.parse(user)));
        dispatch(setUserId(userId));
        dispatch(setRole(role));
      }
    };

    checkLoginState();
  }, [dispatch]);

  return isLoggedIn ? <BottomTabNavigator /> : <OnboardingNavigation />;
};