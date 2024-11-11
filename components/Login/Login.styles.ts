import { StyleSheet } from 'react-native';

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
  

export default styles