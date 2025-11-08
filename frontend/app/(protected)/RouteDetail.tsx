import { decode } from "@googlemaps/polyline-codec";
import { useMemo, useRef } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import MapView from "react-native-maps";
import { Redirect, router } from "expo-router";

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { Text } from "@/components/ui/Text";
import Polyline from "@/components/ui/maps/Polyline";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePlanStore } from "@/store/plan";

const lineColors = ["#00072d", "#0a2472", "#0e6ba8", "#001c55"];

export default function RouteDetail() {
  const { selectingPlan } = usePlanStore();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["25%", "90%"], []);

  if (!selectingPlan) {
    return <Redirect href="/(protected)/SearchResult" />
  }

  const distance = selectingPlan.legs
    .reduce((acc, leg) => acc + (leg.distanceMeters ?? 0), 0);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }} className="relative">
        
        <SafeAreaView className="absolute top-0 z-10 p-4">
          <Pressable onPressIn={() => router.back()}>
            <Ionicons name="arrow-back" size={24}  />
          </Pressable>
        </SafeAreaView>

        <MapView style={StyleSheet.absoluteFill}>
          {selectingPlan?.legs
            ?.flatMap((leg) => leg.polyline?.encodedPolyline)
            .map((line, index) => 
              <Polyline
                key={index}
                coordinates={decode(line!, 5)
                  .map(([lat, lng]) => ({
                    latitude: lat,
                    longitude: lng
                  }))
                }
                strokeColor={lineColors[index % lineColors.length]}
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
              <Text className="text-zinc-600">
                {(distance / 1000).toFixed(2)} km.
              </Text>
            </View>

            <Text weight="bold" className="text-xl mb-4">
              Step by Step
            </Text>

            <View className="flex-col gap-2">
              {selectingPlan?.legs
                .flatMap((leg) => leg.steps?.flatMap((step) => step))
                ?.filter((step) => step !== undefined)
                ?.filter((step) => step.navigationInstruction?.instructions)
                ?.map((step, index) => {
                const duration = step.duration || "";
                const distance = step.distanceMeters ? `${step.distanceMeters} m.` : "";
                
                if (step.travelMode === "TRANSIT") {
                  const transitDetails = step.transitDetails;
                  const vehicleType = transitDetails?.transitLine?.vehicle?.type || "TRANSIT";
                  const isBus = vehicleType === "BUS";
                  
                  return (
                    <View key={index} className="flex-row items-start gap-3 bg-white p-3 rounded-lg border border-zinc-300">
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
                  <View key={index} className="flex-row items-start gap-3 bg-white p-3 rounded-lg border border-zinc-300">
                    <MaterialCommunityIcons 
                      name="car" 
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
            onPress={() => router.replace("/(protected)/Navigation")}
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
