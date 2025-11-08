import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { Alert, Linking, StyleSheet } from "react-native";
import { useEffect, useRef } from "react";

import * as Location from 'expo-location';

interface MapsProps {
  children?: React.ReactNode | React.ReactNode[]
}

export default function Maps({ children }: MapsProps) {
  const mapRef = useRef<MapView | null>(null);
  
  async function getLocation() {
    // Check permission
    const { granted } = await Location.getForegroundPermissionsAsync();
    if (!granted) {
      Alert.alert(
        "Permission Denied",
        "Please allow location access in Settings to continue.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }
  }

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      region={{
        latitude: 13.7563,
        longitude: 100.5018,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }}
      showsBuildings={false}
      showsUserLocation
      style={StyleSheet.absoluteFill}
    >
      {children}
    </MapView>
  );
}