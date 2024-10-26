import React, { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import Logo from './Logo';
import DisconnectButton from './DisconnectButton';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';


interface GradientWrapperProps {
    children: ReactNode; 
  }

  const TemplateWrapper: React.FC<GradientWrapperProps> = ({ children }) => {

    const CheckUser = () => {
        const { user } = useAuth();    
        return user ? <DisconnectButton /> : null;
    }

    return (
      
            <LinearGradient colors={['#8EC5FC', '#E0C3FC']} style={styles.gradient}>

                <View style={styles.container}>
                    <Logo></Logo>
                    <CheckUser></CheckUser> 
                    {children}
                </View> 

                </LinearGradient>
      
    );
  };


const styles = StyleSheet.create({
  gradient: {
    flex: 1, 
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TemplateWrapper;
