import {  useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text,  TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Cloud1 from '../../assets/svg/cloud1';
import TemplateWrapper from "../shared/TemplateWrapper/TemplateWrapperView";
import styles from './Home.styles'

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function Home() {

  const navigation = useNavigation<NavigationProp>();

  return (
    
    <TemplateWrapper  withLogo={true}>
      
        <Text style={styles.subtitle}>Accueil</Text>

        <TouchableOpacity style={styles.button}>
          <Ionicons name="home-outline" size={24} color="black" />
          <Text style={styles.buttonText}>Connecter une maison</Text>
        </TouchableOpacity>      

        <TouchableOpacity style={styles.button} onPress={() =>navigation.navigate('Login')}>
          <Ionicons name="person-outline" size={24} color="black" />
          <Text style={styles.buttonText}>Connexion</Text>
        </TouchableOpacity>  
        
        {/* <TouchableOpacity style={styles.button} onPress={() =>navigation.navigate('Dashboard')}>
          <Ionicons name="person-outline" size={24} color="black" />
          <Text style={styles.buttonText}>TEST</Text>
        </TouchableOpacity>       */}

        <TouchableOpacity style={styles.button}>
          <Ionicons name="sunny-outline" size={24} color="black" />
          <Text style={styles.buttonText}>Inscription</Text>
        </TouchableOpacity>
        
        <Cloud1 />
        
      
    </TemplateWrapper>
  );
}


