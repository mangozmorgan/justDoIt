import React from 'react';
import { Text } from 'react-native';
import styles from './LogoHome.styles';
import useFonts from '../../../hooks/useFont';

export default function Logo() {
    
  const fontLoaded = useFonts(); 

  if (!fontLoaded) {
    return null; 
  }

  return (
    <Text style={[styles.title, { fontFamily: 'IngridDarling-Regular' }]}>
      Just Do It !
    </Text>
  );
}
