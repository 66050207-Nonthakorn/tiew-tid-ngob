import { useEffect, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { decode } from "@googlemaps/polyline-codec";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as Location from 'expo-location';

import { useRouteStore } from "@/store/route";
import { Text } from "@/components/ui/Text";
import Polyline from "@/components/ui/maps/Polyline";

export default function Navigation() {
  const { selectingRoute } = useRouteStore();
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);

  const leg = selectingRoute?.legs[0];
  const currentStep = leg?.steps?.[currentStepIndex];
  const nextStep = leg?.steps?.[currentStepIndex + 1];
  const isLastStep = currentStepIndex === (leg?.steps?.length ?? 0) - 1;

  // Get location permission and start watching position
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      // Start watching position
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10, // Update every 10 meters
        },
        (location) => {
          setUserLocation(location);
        }
      );
    })();
  }, []);

  // Calculate the viewport to show current location and next waypoint
  const mapRegion = {
    latitude: userLocation?.coords.latitude ?? currentStep?.startLocation?.latLng?.latitude ?? 13.7563,
    longitude: userLocation?.coords.longitude ?? currentStep?.startLocation?.latLng?.longitude ?? 100.5018,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  const handleNextStep = () => {
    if (!isLastStep) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  if (!selectingRoute) {
    router.back();
    return null;
  }

  return (
    <View className="flex-1">
      <MapView
        style={StyleSheet.absoluteFill}
        region={mapRegion}
        showsUserLocation
        followsUserLocation
      >
        {currentStep && (
          <Polyline
            coordinates={decode(currentStep.polyline?.encodedPolyline!, 5)
              .map(([lat, lng]) => ({
                latitude: lat,
                longitude: lng
              }))
            }
            strokeColor={currentStep.transitDetails?.transitLine?.color}
            travelMode={currentStep.travelMode ?? "TRANSIT"}
          />
        )}
        {nextStep && (
          <Polyline
            coordinates={decode(nextStep.polyline?.encodedPolyline!, 5)
              .map(([lat, lng]) => ({
                latitude: lat,
                longitude: lng
              }))
            }
            strokeColor={nextStep.transitDetails?.transitLine?.color}
            travelMode={nextStep.travelMode ?? "TRANSIT"}
            style={{ opacity: 0.5 }}
          />
        )}

        {nextStep && (
          <Marker
            coordinate={{
              latitude: nextStep.startLocation?.latLng?.latitude!,
              longitude: nextStep.startLocation?.latLng?.longitude!
            }}
          />
        )}
      </MapView>

      <SafeAreaView className="absolute top-0 left-0 right-0 z-10">
        <View className="flex-row items-center justify-between px-4 py-2 bg-white/80">
          <Pressable onPress={() => router.back()} className="p-2">
            <Text>
              <Ionicons name="arrow-back" size={24} />
            </Text>
          </Pressable>
          <Text weight="semibold" className="text-lg">Navigation</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <View className="absolute bottom-0 left-0 right-0 p-4">
        <View className="bg-white rounded-lg shadow-lg p-4">
          {currentStep?.travelMode === "TRANSIT" ? (
            <>
              <View className="flex-row items-center gap-3">
                <MaterialIcons 
                  name={currentStep.transitDetails?.transitLine?.vehicle?.type === "BUS" ? "directions-bus" : "train"}
                  size={24} 
                  color={currentStep.transitDetails?.transitLine?.color ?? "#3b82f6"}
                />
                <View className="flex-1">
                  <Text weight="semibold" className="text-lg">
                    {currentStep.transitDetails?.transitLine?.nameShort || "Transit"}
                  </Text>
                  <Text className="text-zinc-600">
                    {currentStep.transitDetails?.stopDetails?.departureStop?.name} → {currentStep.transitDetails?.stopDetails?.arrivalStop?.name}
                  </Text>
                  <Text className="text-zinc-500 mt-1">
                    {currentStep.transitDetails?.stopCount || 0} stops
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <View className="flex-row items-start gap-3">
                <MaterialCommunityIcons 
                  name="walk" 
                  size={24} 
                  color="#666666"
                />
                <View className="flex-1">
                  <Text className="text-lg">
                    {currentStep?.navigationInstruction?.instructions}
                  </Text>
                  <Text className="text-zinc-500 mt-1">
                    {currentStep?.localizedValues?.distance?.text ?? `${currentStep?.distanceMeters} ม.`}
                  </Text>
                </View>
              </View>
            </>
          )}

          <View className="flex-row justify-between mt-4">
            <Pressable
              onPress={handlePreviousStep}
              disabled={currentStepIndex === 0}
              className={`px-4 py-2 rounded-lg ${currentStepIndex === 0 ? 'opacity-50' : ''}`}
            >
              <Text>Previous</Text>
            </Pressable>
            <Pressable
              onPress={handleNextStep}
              disabled={isLastStep}
              className={`px-4 py-2 rounded-lg bg-blue-500 ${isLastStep ? 'opacity-50' : ''}`}
            >
              <Text className="text-white">Next Step</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
