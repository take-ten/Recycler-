import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import { StatusBar } from 'expo-status-bar';
import OnboardingNavigation from './navigation/OnboardingNavigation';
import { Provider } from 'react-redux';
import store from './store/store';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { login, setUserId, setRole } from './store/authSlice';
import Loading from './components/Loading'; // Import Loading component
import { LoadingProvider, useLoading } from './components/LoadingContext'; // Import Loading Context

export default function App() {
  return (
    <Provider store={store}>
      <LoadingProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <AppNavigator />
        </NavigationContainer>
      </LoadingProvider>
    </Provider>
  );
}

const AppNavigator = () => {
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // Add loading state

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
      setLoading(false); // Set loading to false after checking login state
    };

    checkLoginState();
  }, [dispatch]);

  if (loading) {
    return <Loading />; // Show loading spinner while checking login state
  }

  return isLoggedIn ? <BottomTabNavigator /> : <OnboardingNavigation />;
};