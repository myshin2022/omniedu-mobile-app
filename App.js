import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import StudentDashboardScreen from './screens/StudentDashboardScreen';
import CoursesScreen from './screens/CoursesScreen';
import LearningScreen from './screens/LearningScreen';
import ProgressScreen from './screens/ProgressScreen';
import PremiumUpgrade from './screens/PremiumUpgrade';
import AITutorScreen from './screens/AITutorScreen';
import ConversationTutorScreen from './screens/ConversationTutorScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4A90E2',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{
            title: 'Welcome to OmniEdu',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{
            title: 'Create Account',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="StudentDashboard" 
          component={StudentDashboardScreen}
          options={{
            title: 'Learning Dashboard',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="Courses" 
          component={CoursesScreen}
          options={{
            title: 'All Courses',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="Learning" 
          component={LearningScreen}
          options={{
            title: 'Learning Session',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="Progress" 
          component={ProgressScreen}
          options={{
            title: 'Learning Progress',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="AITutor" 
          component={AITutorScreen}
          options={{
            title: 'AI Tutor',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="ConversationTutor" 
          component={ConversationTutorScreen}
          options={{
            title: 'Conversation Tutor',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="Premium" 
          component={PremiumUpgrade}
          options={{
            title: 'Premium Subscription',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#FFA726',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}