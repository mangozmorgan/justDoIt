import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import { useAuth } from "../../contexts/AuthContext";
import { FormValues } from "../../interfaces/FormLoginInterface";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const LoginLogic = () => {

    const navigation = useNavigation<NavigationProp>();
    const { login } = useAuth(); 
    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>(
      {
        defaultValues: {
          email: '', 
          password: '', 
        },
      }
    );
    
    const onSubmit = async (data: FormValues) => {
        try {
  
          await login(data.email, data.password);
          
          navigation.navigate('Dashboard'); 
  
        } catch (error) {
  
          Toast.show({
            text1: '⛔ Connexion',
            text2: 'Identifiants invalides',
            type: 'error',
            position: 'top',
            visibilityTime: 3000,
            topOffset: 50,
            autoHide: true,
        });
          console.error('Identifiant inconnus', error);
        }
    };

    return {
        onSubmit,
        control,
        navigation,
        isSubmitting,
        errors,
        handleSubmit
    }
}

export default LoginLogic