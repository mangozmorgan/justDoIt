import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import styles from './NavBar.styles'

type NavigationProp = StackNavigationProp<RootStackParamList, 'ShoppingList'>;

export default function NavBar(){

    const navigation = useNavigation<NavigationProp>();

    return (
        <View style={styles.navContainer}>
            <View style={styles.nav}>
                <TouchableOpacity style={[styles.card, styles.shoppingListColor]} onPress={() => navigation.navigate('ShoppingList')}>
                    <Ionicons name="basket-outline" size={24} color="white" />
                    {/* <Text style={styles.textWhite}>Liste de courses</Text> */}
                </TouchableOpacity>
                <TouchableOpacity style={[styles.card, styles.addTaskColor]} onPress={() => navigation.navigate('AddTask')}>    
                    <Ionicons name="add" size={24} color="white" />
                    {/* <Text style={styles.textWhite}>Ajout de tâche</Text> */}
                </TouchableOpacity>
                <TouchableOpacity style={[styles.card, styles.taskListColor]}>
                    <Ionicons name="list" size={24} color="white" />
                    {/* <Text style={styles.textWhite}>Voir les tâches</Text> */}
                </TouchableOpacity>
                <TouchableOpacity style={[styles.card, styles.ParamsColor]}>
                    <Ionicons name="cog-outline" size={24} color="white" />
                    {/* <Text style={styles.textWhite}>Votre compte</Text> */}
                </TouchableOpacity>    
            </View>
        </View>
        
    )

    
}

