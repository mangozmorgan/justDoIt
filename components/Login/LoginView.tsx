
import styles from './Login.styles'
import Cloud2 from '../../assets/svg/cloud2';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react'; 
import {  Text, View, TextInput, TouchableOpacity } from 'react-native';
import {  Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import TemplateWrapper from "../shared/TemplateWrapper/TemplateWrapperView";
import LoginLogic from './LoginLogic';

// Prévenir l'auto-masquage de l'écran de démarrage
SplashScreen.preventAutoHideAsync();

export default function Login() {

  const {
    onSubmit,
    control,
    navigation,
    isSubmitting,
    errors,
    handleSubmit
    
  } = LoginLogic()

  return (
      <TemplateWrapper withLogo={true}>
        <View style={styles.formContainer}>
            <Text style={styles.subtitle}>Connexion</Text>
            
            <Controller
            control={control}
            rules={{
                required: 'Email requis',
                pattern: {
                value: /^\S+@\S+$/i,
                message: 'Email invalide',
                },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                style={styles.input}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value || ''} 
                placeholder="Email"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                />
            )}
            name="email"
            />
            {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

            <Controller
            control={control}
            rules={{ required: 'Mot de passe requis' }}
            render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                style={styles.input}
                secureTextEntry
                onChangeText={onChange}
                onBlur={onBlur}
                value={value || ''}
                placeholder="Mot de passe"
                autoCapitalize="none"
                autoComplete="password"
                textContentType="password"
                />
            )}
            name="password"
            />
            {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
            <Text style={styles.buttonText}>Me connecter</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={24} color="black" />
            <Text style={styles.buttonText}>Retour</Text>
            </TouchableOpacity>

        </View>
        <Cloud2 />   
      </TemplateWrapper>
  );
};


