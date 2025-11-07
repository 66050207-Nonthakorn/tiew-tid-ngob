import { useRouteStore } from "@/store/route";
import { decode } from "@googlemaps/polyline-codec";
import { useMemo, useRef } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import MapView from "react-native-maps";
import { router } from "expo-router";

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { Text } from "@/components/ui/Text";
import Polyline from "@/components/ui/maps/Polyline";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RouteDetail() {
  const { selectingRoute } = useRouteStore();
  const leg = selectingRoute?.legs[0];
  
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["25%", "90%"], []);
  const initialRegion = useMemo(() => {
    if (!leg?.steps?.length) return undefined;

    // Get start and end points
    const startPoint = leg.steps[0];
    const endPoint = leg.steps[leg.steps.length - 1];
    
    const startLat = startPoint.startLocation?.latLng?.latitude;
    const startLng = startPoint.startLocation?.latLng?.longitude;
    const endLat = endPoint.endLocation?.latLng?.latitude;
    const endLng = endPoint.endLocation?.latLng?.longitude;

    if (!startLat || !startLng || !endLat || !endLng) return undefined;

    // Calculate center point
    const midLat = (startLat + endLat) / 2;
    const midLng = (startLng + endLng) / 2;

    // Calculate the distance between points
    const latDelta = Math.abs(startLat - endLat);
    const lngDelta = Math.abs(startLng - endLng);

    // Add padding and ensure minimum zoom
    const padding = 0.6; // 60% padding
    const minDelta = 0.005; // Minimum zoom level

    return {
      latitude: midLat,
      longitude: midLng,
      latitudeDelta: Math.max(minDelta, latDelta * (1 + padding)),
      longitudeDelta: Math.max(minDelta, lngDelta * (1 + padding))
    };

  }, [leg?.steps]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }} className="relative">
        
        <SafeAreaView className="absolute top-0 z-10 p-4">
          <Pressable onPressIn={() => router.back()}>
            <Ionicons name="arrow-back" size={24}  />
          </Pressable>
        </SafeAreaView>

        <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={initialRegion}
        >
          {leg?.steps?.map((step, index) => 
            <Polyline
              key={index}
              coordinates={decode(step.polyline?.encodedPolyline!, 5)
                .map(([lat, lng]) => ({
                  latitude: lat,
                  longitude: lng
                }))
              }
              strokeColor={step.transitDetails?.transitLine?.color ?? "#444444"}
              travelMode={step.travelMode ?? "TRANSIT"}
            />
          )}
        </MapView>

        <BottomSheet
          ref={bottomSheetRef}
          enableOverDrag={false}
          enableDynamicSizing={false}
          snapPoints={snapPoints}
          index={1}
        >
          <BottomSheetScrollView 
            contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 10, paddingBottom: 100 }}
            style={{ flex: 1 }}
            bounces={false}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
          >
            <Text weight="bold" className="text-2xl mb-2 mt-4">
              Route Summary
            </Text>
            
            <View className="mb-6 bg-white p-4 rounded-lg shadow-sm">
              <Text className="text-lg">
                {leg?.localizedValues?.duration?.text ?? leg?.staticDuration ?? "-"}
              </Text>
              <Text className="text-zinc-600">
                {leg?.localizedValues?.distance?.text ?? `${leg?.distanceMeters ?? "-"} ม.`}
              </Text>
            </View>

            <Text weight="bold" className="text-xl mb-4">
              Step by Step
            </Text>

            <View className="flex-col gap-4">
              {leg?.steps
                ?.filter((step) => step.navigationInstruction?.instructions)
                ?.map((step, index) => {
                const duration = step.duration || "";
                const distance = step.distanceMeters ? `${(step.distanceMeters / 1000).toFixed(1)} km` : "";
                
                if (step.travelMode === "TRANSIT") {
                  const transitDetails = step.transitDetails;
                  const vehicleType = transitDetails?.transitLine?.vehicle?.type || "TRANSIT";
                  const isBus = vehicleType === "BUS";
                  
                  return (
                    <View key={index} className="flex-row items-start gap-3 bg-white p-3 rounded-lg shadow-sm">
                      <MaterialIcons 
                        name={isBus ? "directions-bus" : "train"}
                        size={24} 
                        color={step.transitDetails?.transitLine?.color ?? "#3b82f6"}
                      />
                      <View className="flex-1">
                        <Text weight="semibold" className="text-base">
                          {vehicleType} - {transitDetails?.transitLine?.nameShort || "Transit"}
                        </Text>
                        <Text className="text-zinc-600 mt-1">
                          {transitDetails?.stopDetails?.departureStop?.name} → {transitDetails?.stopDetails?.arrivalStop?.name}
                        </Text>
                        <Text className="text-zinc-500 text-sm mt-1">
                          {duration} • {distance} • {transitDetails?.stopCount || 0} stops
                        </Text>
                      </View>
                    </View>
                  );
                }

                return (
                  <View key={index} className="flex-row items-start gap-3 bg-white p-3 rounded-lg shadow-sm">
                    <MaterialCommunityIcons 
                      name="walk" 
                      size={24} 
                      color="#666666"
                    />
                    <View className="flex-1">
                      <Text className="text-base">
                        {step.navigationInstruction?.instructions}
                      </Text>
                      <Text className="text-zinc-500 text-sm mt-1">
                        {duration} • {distance}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </BottomSheetScrollView>
        </BottomSheet>

        <View
          className="absolute bottom-0 left-0 right-0 pb-8 px-4 pt-6 bg-white"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.5,
            shadowRadius: 6,
            elevation: 5, // For Android
          }}
        >
          <Pressable 
            onPress={() => router.push("/(protected)/Navigation")}
            className="bg-blue-500 rounded-xl px-4 py-3"
          >
            <Text weight="bold" className="text-white text-center text-lg">
              Start trip
            </Text>
          </Pressable>
        </View>

      </View>
    </GestureHandlerRootView>
  );
}
