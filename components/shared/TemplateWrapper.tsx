import React, { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import Logo from './LogoHome';
import DisconnectButton from './DisconnectButton';
import { useAuth } from '../../contexts/AuthContext';
import LogoAndTitle from './LogoAndTitle';


interface GradientWrapperProps {
    children: ReactNode; 
    withLogo: boolean
  }

  const TemplateWrapper: React.FC<GradientWrapperProps> = ({ children, withLogo = true }) => {

    const IsConnected = () =>{
      const { user } = useAuth();  
      return user ? true : false;
    }

    const DisplayDisconnectButton = () => {
        return IsConnected() ? <DisconnectButton /> : null;
    }

    return (
      
            <LinearGradient colors={['#8EC5FC', '#E0C3FC']} style={styles.gradient}>

                <View style={styles.container}>
                  {withLogo ? IsConnected()  ? <LogoAndTitle ></LogoAndTitle> : <Logo></Logo> : null}
                  {/* { IsConnected()  ? <LogoAndTitle ></LogoAndTitle> : <Logo></Logo> } */}

                    
                    <DisplayDisconnectButton></DisplayDisconnectButton> 
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
