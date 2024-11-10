import { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const fetchFonts = () => {
  return Font.loadAsync({
    'IngridDarling-Regular': require('../assets/fonts/IngridDarling-Regular.ttf'),
  });
};

const useFonts = () => {
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

  return fontLoaded;
};

export default useFonts;
