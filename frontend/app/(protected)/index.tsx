import { SafeAreaView } from "react-native-safe-area-context";
import MapView from "react-native-maps";

import { StyleSheet } from "react-native"

export default function HomePage() {
  

  return (
    <SafeAreaView className="size-full">
      <MapView
        region={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        style={StyleSheet.absoluteFill}
      />
    </SafeAreaView>
  );
}