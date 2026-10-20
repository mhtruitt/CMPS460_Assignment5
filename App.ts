// App.tsx
//
// Entry point. Sets up a stack navigator with two screens:
//   Tasks      - the local task list (AsyncStorage)
//   Suggested  - the API-powered screen (JSONPlaceholder)

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TasksScreen from './screens/TasksScreen';
import SuggestedTasksScreen from './screens/SuggestedTasksScreen';
import { RootStackParamList } from './types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Tasks"
        screenOptions={{
          headerStyle: { backgroundColor: '#4A55A2' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <Stack.Screen name="Tasks" component={TasksScreen} options={{ title: 'Task Manager' }} />
        <Stack.Screen
          name="Suggested"
          component={SuggestedTasksScreen}
          options={{ title: 'Suggested Tasks' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
