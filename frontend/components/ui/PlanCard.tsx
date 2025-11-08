import { View, Pressable, GestureResponderEvent } from "react-native";
import MapView, { Polyline } from "react-native-maps";
import { decode } from "@googlemaps/polyline-codec";
import { Text } from "@/components/ui/Text";
import { useRouter } from "expo-router";
import { Plan } from "@/types/plan";
import { usePlanStore } from "@/store/plan";

interface RouteCardProps {
  plan: Plan;
  index?: number;
}

export default function PlanCard({ plan, index }: RouteCardProps) {
  const { setSelectingPlan } = usePlanStore();
  const router = useRouter();

  const initialRegion = (() => {
    const coords = plan.legs.flatMap((leg) =>
      decode(leg.polyline?.encodedPolyline!, 5).map(([lat, lng]) => ({
        latitude: lat,
        longitude: lng
      }))
    );

    const lats = coords.map(c => c.latitude);
    const lngs = coords.map(c => c.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const midLat = (minLat + maxLat) / 2;
    const midLng = (minLng + maxLng) / 2;
    const latDelta = Math.max(0.002, (maxLat - minLat) * 1.2);
    const lngDelta = Math.max(0.002, (maxLng - minLng) * 1.2);

    return {
      latitude: midLat,
      longitude: midLng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta
    };

  })();

  function onPressCard(e: GestureResponderEvent) {
    e.stopPropagation();
    setSelectingPlan(plan);
    router.push("/(protected)/RouteDetail");
  }

  const distance = plan.legs.reduce((acc, leg) => acc + (leg.distanceMeters || 0), 0);
  const price = Math.round(20 * (distance / 1000));

  return (
    <Pressable onPress={onPressCard} className="bg-white rounded-lg px-4 py-2.5 border border-zinc-200">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <View className="flex-row justify-between">
            <View className="max-w-[75%]">
              <Text weight="bold" className="mb-2 text-lg">
                Route {index != null ? index + 1 : ""}
              </Text>
              {plan.placeNames.map((name) =>
                <Text key={name.text} className="text-sm">
                  - {name.text}
                </Text>
              )}
            </View>
            <View className="items-end">
              <Text weight="semibold">
                ~ {price} baht
              </Text>
              <Text className="text-gray-600 text-sm">
                {(distance / 1000).toFixed(2)} km.
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="mt-3 rounded-md overflow-hidden">
        <MapView
          style={{ height: 120 }}
          initialRegion={initialRegion}
          scrollEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
          zoomEnabled={false}
          pointerEvents="none"
        >
          {plan.legs.map((leg, index) =>
            <Polyline
              key={index}
              coordinates={decode(leg.polyline?.encodedPolyline!, 5).map(([lat, lng]) => ({
                latitude: lat,
                longitude: lng
              }))}
              strokeColor="#3333FF"
              strokeWidth={2}
            />
          )}
        </MapView>
      </View>
    </Pressable>
  );
}