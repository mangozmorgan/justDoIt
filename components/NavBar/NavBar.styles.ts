
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

    navContainer: {
        width: '100%',
        display: 'flex',
        marginBottom: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }, 
    nav: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        width: '100%',
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

export default styles