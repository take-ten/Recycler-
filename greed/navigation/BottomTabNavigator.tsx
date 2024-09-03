import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MessageScreen from '../app/screens/ChatScreen';
import ProfileScreen from '../app/screens/ProfileScreen';
import HomeStackNavigator from './HomeStackNavigator';
import HistoryScreen from '@/app/screens/HistoryScreen';

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
      <Tab.Screen name="History" component={HistoryScreen}  />
      <Tab.Screen name="Profile" component={ProfileScreen}  />
    </Tab.Navigator>
  );
}