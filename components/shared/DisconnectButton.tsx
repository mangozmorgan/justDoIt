
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default  function DisconnectButton() {

    const { logout } = useAuth();
    const navigation = useNavigation<NavigationProp>();

    const disconnect = async () => {

        await logout()

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
        
        navigation.navigate('Home')
    }

    return (
        
        <TouchableOpacity style={styles.button} onPress={disconnect}>
          <Ionicons name="log-out-outline" size={30} color="white" />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    
    button: {
      position: 'absolute',
      top: 30,
      right:20,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 100,
      justifyContent: 'center',
    },
})    