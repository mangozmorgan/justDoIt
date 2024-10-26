import React, { useEffect, useState } from 'react'; 
import { Text, StyleSheet } from 'react-native'; 
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const fetchFonts = () => {
    return Font.loadAsync({
      'IngridDarling-Regular': require('../../assets/fonts/IngridDarling-Regular.ttf'),
    });
};

export default function Logo() {
    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
        const loadResources = async () => {
            try {
                await fetchFonts(); 
                setFontLoaded(true);
            } catch (error) {
                console.error(error);
            } finally {
                SplashScreen.hideAsync(); 
            }
        };

        loadResources();
    }, []);

    if (!fontLoaded) {
        return null; 
    }

    return (
        <Text style={[styles.title, { fontFamily: 'IngridDarling-Regular' }]}>
            Just Do It !  
        </Text>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 70,
        color: '#fff',
        marginBottom: 10,
    },
});
