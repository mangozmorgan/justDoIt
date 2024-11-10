// LogoAndTitleView.tsx
import React from 'react';
import { View } from 'react-native';
import Cloud3 from '../../../assets/svg/cloud3';
import useFont from '../../../hooks/useFont'; 
import styles from './LogoAndTitle.styles';

const LogoAndTitleView = () => {
  const fontLoaded = useFont(); 

  if (!fontLoaded) {
    return null; 
  }

  return (
    <View style={styles.logoContainer}>
      <View style={styles.svgContainer}>
        <Cloud3 />
      </View>
    </View>
  );
};

export default LogoAndTitleView;
