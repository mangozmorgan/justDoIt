
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';
import { GradientWrapperProps } from '../../../interfaces/GradientWrapperPropsInterface';
import  TemplateWrapperLogic  from './TemplateWrapperLogic'; // Import du hook de logique
import styles from './TemplateWrapper.styles'; // Import des styles
import DisconnectButton from '../DisconnectButton/DisconnectButtonView';

const TemplateWrapperView: React.FC<GradientWrapperProps> = ({ children, withLogo = true }) => {
  const {  displayDisconnectButton, getLogo } = TemplateWrapperLogic(); 

  return (
    <LinearGradient colors={['#8EC5FC', '#E0C3FC']} style={styles.gradient}>
      <View style={styles.container}>
        {withLogo ? getLogo() : null}
        {displayDisconnectButton() && <DisconnectButton />}
        {children}
      </View>
    </LinearGradient>
  );
};

export default TemplateWrapperView;
