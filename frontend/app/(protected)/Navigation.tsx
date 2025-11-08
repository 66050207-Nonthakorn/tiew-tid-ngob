import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { decode } from "@googlemaps/polyline-codec";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as Location from 'expo-location';

import { Text } from "@/components/ui/Text";
import Polyline from "@/components/ui/maps/Polyline";
import { Timer } from "@/lib/time";
import { usePlanStore } from "@/store/plan";

export default function Navigation() {
  const { selectingPlan } = usePlanStore();
  const { setFinishedCheckpoints } = usePlanStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const timerRef = useRef(new Timer());
  const [elapsedStr, setElapsedStr] = useState("");

  const leg = selectingPlan?.legs[0];
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
    })();
  }, []);

  useEffect(() => {
    timerRef.current.start();
    const interval = setInterval(() => {
      setElapsedStr(timerRef.current.getElapsedFormatted());
    }, 10);

    return () => clearInterval(interval);
  }, []);
  

  // Calculate the viewport to show current location and next waypoint
  const mapRegion = {
    latitude: currentStep?.startLocation?.latLng?.latitude ?? 13.7563,
    longitude: currentStep?.startLocation?.latLng?.longitude ?? 100.5018,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  const handleNextStep = () => {
    timerRef.current.checkpoint();

    if (!isLastStep) {
      setCurrentStepIndex(prev => prev + 1);
    }
    else {
      timerRef.current.pause();
      setFinishedCheckpoints(timerRef.current.getCheckpoints());
      router.replace("/(protected)/TripSummary");
    }
  };

  if (!selectingPlan) {
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
        <View className="flex-row items-center justify-between px-4 py-2">
          <Pressable onPress={() => router.back()} className="p-2">
            <Text>
              <Ionicons name="arrow-back" size={24} />
            </Text>
          </Pressable>
          <Text weight="bold" className="text-lg">
            Navigation
          </Text>
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

          <View>
            <Text>{elapsedStr}</Text>
          </View>

          <View className="flex-row justify-between mt-4">
            <Pressable
              onPress={handleNextStep}
              className={`px-4 py-2.5 rounded-lg bg-blue-500 w-full items-center ${isLastStep ? "bg-blue-900" : ""}`}
            >
              <Text weight="semibold" className="text-white text-lg">
                {isLastStep ? "Finish" : "Next"}
              </Text>
            </Pressable>
          </View>

        </View>
      </View>
    </View>
  );
}
