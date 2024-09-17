import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ProfileScreen from '../app/screens/ProfileScreen';
import HomeStackNavigator from './HomeStackNavigator';
import HistoryNavigation from './HistoryNavigation';
import About from '../app/screens/About';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'History') {
            iconName = 'chatbubbles';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }
          else if (route.name === 'About') {
            iconName = 'information-circle';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen name="History" component={HistoryNavigation} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="About" component={About} />
    </Tab.Navigator>
  );
}