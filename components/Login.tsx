import { LinearGradient } from 'expo-linear-gradient';
import Cloud2 from '../assets/svg/cloud2';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react'; 
import { useAuth } from '../contexts/AuthContext';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { FormValues } from '../interfaces/FormValueInterface';
import { useNavigation } from '@react-navigation/native'; 
import { Ionicons } from '@expo/vector-icons';
import TemplateWrapper from './shared/TemplateWrapper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// Prévenir l'auto-masquage de l'écran de démarrage
SplashScreen.preventAutoHideAsync();

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function Login() {
  
  const navigation = useNavigation<NavigationProp>();

  const MyForm = () => {
    const { login } = useAuth(); 
    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
      defaultValues: {
        email: '', 
        password: '', 
      },
    });

    const onSubmit = async (data: FormValues) => {
      try {
        await login(data.email, data.password);
        navigation.navigate('Dashboard'); 
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
      }
    };

    return (
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
              value={value || ''} // Assurez-vous que 'value' n'est jamais undefined
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
              value={value || ''} // Assurez-vous que 'value' n'est jamais undefined
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
    );
  };

  return (
      <TemplateWrapper>
        <MyForm />
          <Cloud2 />   
      </TemplateWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    position: 'relative',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 24,
    color: '#fff',
    marginBottom: 40,
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
  buttonText: {
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
  input: {
    color: 'black',
    height: 50,
    backgroundColor: 'white',
    width: 250,
    paddingHorizontal: 10,
    borderRadius: 30,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
