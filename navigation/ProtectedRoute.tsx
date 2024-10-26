import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; 
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './AppNavigator';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();

  useEffect(() => {
    // Rediriger si l'utilisateur n'est pas authentifié
    if (user === null || !user) {
      navigation.navigate('Home');
    }
  }, [user, navigation]); // Effectue la redirection lorsque 'user' change

  // Si l'utilisateur n'est pas encore déterminé, vous pouvez retourner null ou un composant de chargement
  if (user === null) {
    return null; // ou un loader simple si vous le souhaitez
  }

  // Rendre les enfants si l'utilisateur est authentifié
  return <>{children}</>;
};

export default ProtectedRoute;
