
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    topContainer: {
      display: 'flex',
      alignItems: 'center',
      height: '20%',
    },
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      overflow: 'scroll',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalTask: {
      borderRadius: 5,
      padding: 20,
      maxWidth: '95%',
      backgroundColor: '#fff',
    },
    modalTaskHeader: {
      alignItems: 'flex-end'
    },
    subtitle: {
      fontSize: 24,
      textAlign: 'center',
      color: '#fff',
      marginBottom: 20,
    },
    modalTitle: {
      fontWeight: 'bold',
      fontSize: 24,
      textAlign: 'center',
      marginBottom: 20,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#A9C6FF',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 10,
      marginBottom: 5,
      width: '100%',
      justifyContent: 'center',
    },
    buttonRemove: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#eb4d4b',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 10,
      marginBottom: 20,
      width: '100%',
      justifyContent: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 15.5,
      marginLeft: 10,
    },
    littleBold: {fontWeight: 'bold'},
    cloudContainer: {
      color: '#fff',
      opacity: 0.6,
      position: 'absolute',
      bottom: 50,
      alignItems: 'center',
    },
    task: {   
      display: 'flex',
      flexDirection: 'row', 
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
      width: '95%',
      paddingVertical: 10, 
      paddingHorizontal: 15,
      backgroundColor: '#A9C6FF',
      borderRadius: 10
    },
    futurTaskColor: {
      backgroundColor: "#D0ABFD"
    },
    lateTaskColor: {
      backgroundColor: "#F7D794"
    },
    taskName: {
      fontSize: 18,
      width: '60%',
      color: '#fff',
    },
    today: {
      fontSize: 24,
      color: 'white',
      marginBottom: 10
    },
    tasksContainer: {
      display: 'flex',
      marginHorizontal: 20,
      paddingVertical: 10,
      paddingBottom: 30,
      alignItems: 'center',
      borderRadius: 10,  
      width: 320,
      height:'90%',
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    scrollPart: {
      height:'15%',
      overflow: 'scroll',
    },
    thereTasks:{
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%',
    },
    taskStatus: {
      fontSize: 16,
      color: '#fff',
      opacity: 0.7,
    },
  });

  export default styles