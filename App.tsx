import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  return (
      <View style={styles.innerContainer}>
        <AppNavigator />
      </View>
  );
}

const styles = StyleSheet.create({  

  container: {    
    flex: 1,
  },
  innerContainer: {
    flex: 1, 
    backgroundColor: 'transparent', 
  },
});
