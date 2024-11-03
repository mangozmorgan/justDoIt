import {  useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Cloud1 from '../assets/svg/cloud1';
import TemplateWrapper from './shared/TemplateWrapper';

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
        
        <TouchableOpacity style={styles.button} onPress={() =>navigation.navigate('Dashboard')}>
          <Ionicons name="person-outline" size={24} color="black" />
          <Text style={styles.buttonText}>TEST</Text>
        </TouchableOpacity>      

        <TouchableOpacity style={styles.button}>
          <Ionicons name="sunny-outline" size={24} color="black" />
          <Text style={styles.buttonText}>Inscription</Text>
        </TouchableOpacity>
        
        <Cloud1 />
        
      
    </TemplateWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'transparent',
  },
  
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 20,
    width: 250,
    justifyContent: 'center',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 24,
    color: '#fff',
    marginBottom: 40,
  },
  buttonText: {
    color: 'black',
    fontSize: 15.5,
    marginLeft: 10,
  },
  cloudContainer: {
    color: '#fff',
    opacity: 0.6,
    zIndex: 0,
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
});
