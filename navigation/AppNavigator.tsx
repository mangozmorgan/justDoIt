import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../components/Home/HomeView';
import Login from '../components/Login/LoginView';
import Toast from 'react-native-toast-message';
import Dashboard from '../components/Dashboard/DashboardView';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import ShoppingList from '../components/ShoppingList/ShoppingListView';
import AddTask from '../components/AddTask/AddTaskView';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Dashboard: undefined;
  ShoppingList: undefined;
  AddTask: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { user, loading } = useAuth(); 
  
  if (loading) {
    return null; 
  }
  
  const initialRoute = user ? 'Dashboard' : 'Home'; 

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Dashboard">
        {() => (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )}
      </Stack.Screen>
      <Stack.Screen name="ShoppingList">
        {() => (
          <ProtectedRoute>
            <ShoppingList />
          </ProtectedRoute>
        )}
      </Stack.Screen>
      <Stack.Screen name="AddTask">
        {() => (
          <ProtectedRoute>
            <AddTask />
          </ProtectedRoute>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
        <Toast />
      </NavigationContainer>
    </AuthProvider>
  );
}
