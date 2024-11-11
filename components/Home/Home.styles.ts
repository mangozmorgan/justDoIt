
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      backgroundColor: 'transparent',
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
    subtitle: {
      textAlign: 'center',
      fontSize: 24,
      color: '#fff',
      marginBottom: 40,
    },
    buttonText: {
      color: 'black',
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
  });


  export default styles