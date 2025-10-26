import "../global.css";

import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import * as Location from 'expo-location';

import { useFonts } from "expo-font";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isFontLoaded] = useFonts({
    NunitoSans: require("@/assets/fonts/NunitoSans-Regular.ttf"),
    NunitoSansBold: require("@/assets/fonts/NunitoSans-Bold.ttf"),
    NunitoSansSemiBold: require("@/assets/fonts/NunitoSans-SemiBold.ttf"),
    NunitoSansLight: require("@/assets/fonts/NunitoSans-Light.ttf"),
  });

  const [isLocationPermissionGranted, setIsLocationPermissionGranted] = useState(false);

  useEffect(() => {
    (async () => {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (granted) {
        setIsLocationPermissionGranted(true);
      }
    })();
  }, [])

  useEffect(() => {
    if (isFontLoaded && isLocationPermissionGranted) {
      SplashScreen.hide();
    }
  }, [isFontLoaded, isLocationPermissionGranted]);

  if (!isFontLoaded || !isLocationPermissionGranted) return null;

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
      
        <Stack.Protected guard={true}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        
        <Stack.Protected guard={true}>
          <Stack.Screen name="(protected)" />
        </Stack.Protected>
      
      </Stack>
    </SafeAreaProvider>
  );
}
