
import { useAuth } from '../../../contexts/AuthContext';
import Toast from 'react-native-toast-message';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const useDisconnectButton = () => {
    const { logout } = useAuth();
    const navigation = useNavigation<NavigationProp>();

    const disconnect = async () => {
        await logout();
        Toast.show({
            text1: '🔓 Déconnexion',
            text2: 'Vous êtes déconnecté avec succès',
            type: 'success',
            position: 'top',
            visibilityTime: 3000,
            topOffset: 50,
            autoHide: true,
            onPress: () => {
                console.log('Toast pressé !');
            },
        });
        navigation.navigate('Home');
    };

    return { disconnect };
}

export default useDisconnectButton
