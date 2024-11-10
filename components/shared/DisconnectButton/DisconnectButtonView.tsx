

import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import  useDisconnectButton  from './DisconnectButton.types';
import styles from './DisconnectButton.styles';

const DisconnectButtonView = () => {

    const { disconnect } = useDisconnectButton();

    return (
        <TouchableOpacity style={styles.button} onPress={disconnect}>
            <Ionicons name="log-out-outline" size={30} color="white" />
        </TouchableOpacity>
    );
}

export default DisconnectButtonView
