import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function NavBar(){
    return (
        <View style={styles.navContainer}>
            <View style={styles.nav}>
                <TouchableOpacity style={[styles.card, styles.shoppingListColor]}>
                    <Ionicons name="basket-outline" size={24} color="white" />
                    {/* <Text style={styles.textWhite}>Liste de courses</Text> */}
                </TouchableOpacity>
                <TouchableOpacity style={[styles.card, styles.addTaskColor]}>    
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

const styles = StyleSheet.create({

    navContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    }, 
    nav: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        width: '90%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        borderRadius: 10
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20,
        textAlign: 'center',        
        maxWidth: '25%',
        fontSize: 12, 
        borderRadius: 10
    },
    textWhite: {
        textAlign: 'center',
        color: 'white',
    },
    shoppingListColor: {
        backgroundColor: '#D0ABFD',
    },
    addTaskColor: {
        backgroundColor: '#A9C6FF',
    },
    taskListColor: {
        backgroundColor: '#F7D794',
    },
    ParamsColor: {
        backgroundColor: '#487EB0',
    }
});