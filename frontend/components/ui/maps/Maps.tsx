import MapView, { Callout, LatLng, Marker, PoiClickEvent, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from 'react-native-maps-directions';
import { Alert, Button, Linking, Pressable, StyleSheet } from "react-native";
import { useEffect, useRef, useState } from "react";

import * as Location from 'expo-location';
import { Text } from "../Text";
import { SafeAreaView } from "react-native-safe-area-context";

const bangkokLatLon = {
  latitude: 13.7563,
  longitude: 100.5018,  // Bangkok coordinates
};

export default function Maps() {
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);

  const [poiName, setPoiName] = useState<string>("Empty");
  const [poiCoord, setPoiCoord] = useState<LatLng | null>(null);

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

    // Check if GPS (location services) is enabled
    const servicesEnabled = await Location.hasServicesEnabledAsync();
    if (servicesEnabled) {
      const location = await Location.getCurrentPositionAsync();
      setUserLocation(location);
    }
  }

  useEffect(() => {
    getLocation();
  }, []);

  function onPoiClick(e: PoiClickEvent) {
    if (mapRef.current) {
      mapRef.current.animateCamera({
        center: e.nativeEvent.coordinate,
        zoom: 16,
      });

      setPoiCoord(e.nativeEvent.coordinate);
    }
  }

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
      onPoiClick={onPoiClick}
    >
      {poiCoord &&
        <Marker
          coordinate={poiCoord}
        />
      }
    </MapView>
  );
}