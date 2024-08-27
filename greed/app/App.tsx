import { NavigationContainer } from '@react-navigation/native'; // Importing NavigationContainer from react-navigation
import BottomTabNavigator from '../navigation/BottomTabNavigator'; // Importing BottomTabNavigator component
import { StatusBar } from 'expo-status-bar'; // Importing StatusBar from expo-status-bar
import OnboardingNavigation from '../navigation/OnboardingNavigation'; // Importing OnboardingNavigation component
import { Provider } from 'react-redux'; // Importing Provider from react-redux
import store from '../store/store'; // Importing the Redux store
import { useSelector } from 'react-redux'; // Importing useSelector hook from react-redux

export default function App() {
  return (
    // Wrapping the app with the Redux Provider to make the store available to all components
    <Provider store={store} >
      {/* Wrapping the app with NavigationContainer to manage navigation state */}
      <NavigationContainer >
        {/* Setting the status bar style */}
        <StatusBar style="auto"/>
        {/* Rendering the AppNavigator component */}
        <AppNavigator/>
      </NavigationContainer>
    </Provider>
  );
}

// AppNavigator component to conditionally render navigation based on authentication state
const AppNavigator = () => {
  // Getting the isLoggedIn state from the Redux store
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn );

  // If the user is logged in, render BottomTabNavigator, otherwise render OnboardingNavigation
  return isLoggedIn ? <BottomTabNavigator /> : <OnboardingNavigation />;
};