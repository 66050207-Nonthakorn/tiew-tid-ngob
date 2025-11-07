import { useMemo } from "react";
import { View, Pressable, GestureResponderEvent } from "react-native";
import MapView, { LatLng, Polyline } from "react-native-maps";
import { decode } from "@googlemaps/polyline-codec";
import { Route } from "@/types/routes";
import { Text } from "@/components/ui/Text";
import { useRouter } from "expo-router";
import { useRouteStore } from "@/store/route";

interface RouteCardProps {
  route: Route;
  index?: number;
}

export default function RouteCard({ route, index }: RouteCardProps) {
  const { setSelectingRoute } = useRouteStore();

  const router = useRouter();
  const leg = route.legs?.[0];

  const summary = useMemo(() => {
    const distance = leg?.localizedValues?.distance?.text ?? `${leg?.distanceMeters ?? "-"} ม.`;
    const duration = leg?.localizedValues?.duration?.text ?? leg?.staticDuration ?? "-";
    return { distance, duration };
  }, [leg]);

  const previewCoords: LatLng[] = useMemo(() => {
    try {
      const encoded = leg?.polyline?.encodedPolyline ?? leg?.steps?.[0]?.polyline?.encodedPolyline;
      if (!encoded) return [];
      
      return (
        decode(encoded, 5)
          .map(([lat, lng]) => ({
            latitude: lat,
            longitude: lng
          }))
      );
    }
    catch {
      return [];
    }
  }, [leg]);

  const initialRegion = useMemo(() => {
    if (!previewCoords.length) return undefined;

    const lats = previewCoords.map(c => c.latitude);
    const lngs = previewCoords.map(c => c.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const midLat = (minLat + maxLat) / 2;
    const midLng = (minLng + maxLng) / 2;
    const latDelta = Math.max(0.002, (maxLat - minLat) * 1.6);
    const lngDelta = Math.max(0.002, (maxLng - minLng) * 1.6);

    return {
      latitude: midLat,
      longitude: midLng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta
    };

  }, [previewCoords]);

  function onPressCard(e: GestureResponderEvent) {
    e.stopPropagation();
    router.push("/(protected)/RouteDetail");
    setSelectingRoute(route);
  }

  return (
    <Pressable onPress={onPressCard} className="bg-white rounded-lg p-3 shadow-md">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text>
            เส้นทาง {index != null ? index + 1 : ""}
          </Text>
          <Text className="text-sm text-gray-600">
            {summary.distance} • {summary.duration}
          </Text>
          <View className="flex-row gap-2 mt-2 flex-wrap">
            {(leg?.stepsOverview?.multiModalSegments ?? []).map((s, i) => (
              <View key={i} className="flex flex-row gap-2">
                <View className="bg-gray-100 px-2 py-1 rounded-full">
                  <Text className="text-xs text-gray-700">
                    {s.travelMode ?? "MULTI"}
                  </Text>
                </View>
                {i+1 !== leg?.stepsOverview?.multiModalSegments?.length &&
                  <Text>{">"}</Text>
                }
              </View>
            ))}
          </View>
        </View>
      </View>

      {previewCoords.length > 0 && initialRegion && (
        <View className="mt-3 rounded-md overflow-hidden">
          <MapView
            initialRegion={initialRegion}
            style={{ height: 120 }}
            scrollEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
            zoomEnabled={false}
            pointerEvents="none"
          >
            <Polyline
              coordinates={previewCoords}
              strokeColor="#FF5A00" strokeWidth={3}
            />
          </MapView>
        </View>
      )}
    </Pressable>
  );
}

  // const walkSteps = leg?.steps?.filter(s => s.travelMode === "WALK") ?? [];
  // const transitSteps = leg?.steps?.filter(s => s.travelMode === "TRANSIT" && s.transitDetails) ?? [];

  // const formatIsoTime = (iso?: string, timeZone?: string) => {
  //   if (!iso) return undefined;
  //   try {
  //     const dt = new Date(iso);
  //     return new Intl.DateTimeFormat("th-TH", { hour: "2-digit", minute: "2-digit", timeZone: timeZone ?? undefined }).format(dt);
  //   }
  //   catch {
  //     return iso;
  //   }
  // };

      // {expanded && (
      //   <View className="mt-3 border-t pt-3">
      //     {walkSteps.length > 0 && (
      //       <View className="mb-3">
      //         <Text className="font-medium">เดิน</Text>
      //         {walkSteps.map((s, i) => (
      //           <View key={i} className="mt-2">
      //             {s.navigationInstruction?.instructions && <Text className="text-sm">{s.navigationInstruction.instructions}</Text>}
      //             {s.localizedValues?.distance?.text && <Text className="text-xs text-gray-500">{s.localizedValues.distance.text} • {s.localizedValues.staticDuration?.text ?? ''}</Text>}
      //           </View>
      //         ))}
      //       </View>
      //     )}

      //     {transitSteps.length > 0 && (
      //       <View>
      //         <Text className="font-medium">ขนส่งสาธารณะ</Text>
      //         {transitSteps.map((s, i) => {
      //           const td = s.transitDetails!;
      //           const dep = td.stopDetails?.departureStop?.name;
      //           const arr = td.stopDetails?.arrivalStop?.name;
      //           const depIso = td.stopDetails?.departureTime;
      //           const arrIso = td.stopDetails?.arrivalTime;
      //           const tz = td.localizedValues?.departureTime?.timeZone ?? td.localizedValues?.arrivalTime?.timeZone;
      //           return (
      //             <View key={i} className="mt-2">
      //               <Text className="text-sm font-medium">{td.transitLine?.name ?? td.headsign ?? 'Transit'}</Text>
      //               <Text className="text-sm">{dep ?? '—'} ➜ {arr ?? '—'}</Text>
      //               <Text className="text-xs text-gray-500">{formatIsoTime(depIso, tz) ?? td.localizedValues?.departureTime?.time?.text} — {formatIsoTime(arrIso, tz) ?? td.localizedValues?.arrivalTime?.time?.text} {td.stopCount ? `• ${td.stopCount} stops` : ''}</Text>
      //               {td.transitLine?.agencies && <Text className="text-xs text-gray-600">{td.transitLine.agencies.map(a => a.name).filter(Boolean).join(', ')}</Text>}
      //             </View>
      //           );
      //         })}
      //       </View>
      //     )}
      //   </View>
      // )}