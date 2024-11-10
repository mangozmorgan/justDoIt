
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    selectedText: {
      marginTop: 16,
      fontSize: 16,
    },
    buttonDisabled: {
      backgroundColor: '#D9D9D9', 
      opacity: 0.5, 
    },
    activatedButton : {
      backgroundColor: '#6CC81D',
      color: 'white'
    },
    blocForm: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 10,
      width: "100%",
      marginBottom: 10,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 10,
      marginBottom: 20,
      width: '100%',
      justifyContent: 'center',
    },
    buttonText: {
      fontSize: 15.5,
      marginLeft: 10,
      color: 'white'
    },
    headerValidation: {
      flexDirection: 'row',
      maxWidth: '70%',
      alignItems: 'center'
    },
    pickerInput: {
      fontSize: 14,
      display: 'flex',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: '#D9D9D9',
      borderRadius: 8,
      color: 'black',
      backgroundColor: '#fff',
      marginBottom: 10,
    },
    buttonPickers: {
        marginVertical: 5,
    },
    pageWidth: {
      paddingVertical: 80,
      width: "100%",
      alignItems: 'center',
    },
    dateContainer: {
      width: "100%",
    },
    containPicker: {
      padding: 10,
      marginTop: 15
    },
    headerBloc: {
      flexDirection: 'row',
      alignItems: 'center', 
      justifyContent: 'space-between', 
    },
    toggleButton: {
      padding: 5, 
    },
    iconBox: {
      borderColor: '#D9D9D9',
      alignItems: 'center',
      borderRadius: 10,
      width: '35%',
      margin: 5,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderWidth: 1,
    },
    toggleText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    },
    selectedIconBox: {
      borderColor: '#6CC81D', 
      color: '#6CC81D', 
    },
    typeContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: "100%",
    },
    input: {
      color: 'black',
      height: 50,
      borderColor: "#D9D9D9",
      borderWidth: 1,
      backgroundColor: 'white',
      width: '100%',
      paddingHorizontal: 10,
      borderRadius: 10,
      marginBottom: 10,
    },
    scrollable: {
      width: '90%',
  
    },
    formContainer: {
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      borderRadius: 10,
      paddingVertical: 20,
      paddingHorizontal: 20,
      position: 'relative',
      zIndex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
      color: 'black',
      width: "100%",
    },
    labelPicker: {
      fontSize: 14,
      color: "#D9D9D9",
      borderColor: "#D9D9D9",
      textAlign: 'center',
      padding: 5 ,
      width:'95%',
      borderWidth: 1,
      borderRadius: 5,    
      marginLeft:5
    },
  
    labelHeader: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
      color: 'black',
      width: "80%",
    },
    labelIcon: {
      textAlign: 'center',
      fontSize: 16,
      marginBottom: 5,
      color: '#D9D9D9',
    },
    error: {
      color: 'red',
      marginBottom: 10,
    },
    subtitle: {
      textAlign: 'center',
      fontSize: 24,
      color: '#fff',
      marginBottom: 40,
    },
  });

  export default styles