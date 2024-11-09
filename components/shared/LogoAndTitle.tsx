import React, { useEffect, useState } from 'react'; 
import { Text, StyleSheet, View } from 'react-native'; 
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Cloud3 from '../../assets/svg/cloud3';



const fetchFonts = () => {
    return Font.loadAsync({
      'IngridDarling-Regular': require('../../assets/fonts/IngridDarling-Regular.ttf'),
    });
};

export default function LogoAndTitle(){
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
        <View style={styles.logoContainer}>
            <View style={styles.svgContainer}>
                <Cloud3></Cloud3>                
            </View>
            {/* <Text style={[styles.title, { fontFamily: 'IngridDarling-Regular' }]}>
                    Just Do It !  
            </Text> */}
            
        </View>
        
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 70,
        color: '#fff',
        marginBottom: 10,
    },
    logoContainer: {
        paddingTop: 80,
        display: 'flex', 
        alignItems: 'center',
        flexDirection: 'row'
    },
    svgContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        height: '100%'
    }
});
