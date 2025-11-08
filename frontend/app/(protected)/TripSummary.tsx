import { View, ScrollView } from "react-native";
import { Text } from "@/components/ui/Text";
import { usePlanStore } from "@/store/plan";
import { Link, Redirect } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { saveTrip } from "@/lib/trip";

export default function TripSummary() {
  const { selectingPlan, finishedCheckpoints, clearPlan } = usePlanStore();

  useEffect(() => {
    if (!finishedCheckpoints || !selectingPlan) {
      return;
    }

    (async function () {
      await saveTrip(selectingPlan, finishedCheckpoints);
      clearPlan();
    })();

  }, [clearPlan, finishedCheckpoints, selectingPlan]);

  if (!finishedCheckpoints || !selectingPlan) {
    return <Redirect href="/(protected)" />
  }

  // Format a date to show time only in 24-hour format
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate time difference between two dates in minutes
  const getTimeDiff = (date1: Date, date2: Date) => {
    const diff = Math.abs(date2.getTime() - date1.getTime());
    return Math.round(diff / 1000 / 60);
  };

  const timeFinished = finishedCheckpoints.map(checkpoint => new Date(checkpoint));
  const lastIndex = timeFinished.length - 1;

  // Calculate total trip duration
  const totalDuration = lastIndex >= 0 
    ? getTimeDiff(timeFinished[0], timeFinished[lastIndex]) : 0;

  return (
    <View className="flex-1 bg-white">
      <Text className="text-zinc-500 mt-4 ml-6">
        Total {totalDuration} mins
      </Text>

      <ScrollView className="flex-1 p-4 pb-20 mb-20">
        {selectingPlan.placeNames.map((place, index) => {
          const arrivalTime = timeFinished[index];
          const previousArrivalTime = index > 0 ? timeFinished[index - 1] : null;
          const timeDiff = previousArrivalTime
            ? getTimeDiff(previousArrivalTime, arrivalTime)
            : null;

          return (
            <View key={index} className="flex-row">
              <View className="w-12 items-center">
                <View className="w-3 h-3 rounded-full bg-blue-500 z-10" />
                {index < selectingPlan.placeNames.length - 1 && (
                  <View className="w-0.5 h-24 bg-gray-300 -mt-1.5" />
                )}
              </View>

              <View className="flex-1 -mt-1.5 pb-8">
                <Text weight="semibold" className="text-lg">
                  {place.text}
                </Text>
                <Text className="text-zinc-500">
                  Arrived at {formatTime(arrivalTime)}
                </Text>

                {timeDiff && (
                  <View className="flex-row items-center mt-2 bg-gray-50 p-2 rounded">
                    <MaterialIcons name="timer" size={16} color="#666666" />
                    <Text className="text-zinc-600 ml-1">
                      {timeDiff} mins from previous stop
                    </Text>
                  </View>
                )}

                {index < selectingPlan.placeNames.length - 1 && selectingPlan.legs[index] && (
                  <View className="mt-2">
                    {selectingPlan.legs[index].steps?.map((step, stepIndex) => (
                      <View key={stepIndex} className="flex-row items-center gap-2 mt-1">
                        <MaterialIcons
                          name={step.travelMode === 'TRANSIT' 
                            ? step.transitDetails?.transitLine?.vehicle?.type === 'BUS'
                              ? 'directions-bus'
                              : 'train'
                            : 'directions-walk'
                          }
                          size={16}
                          color={step.transitDetails?.transitLine?.color ?? '#666666'}
                        />
                        <Text className="text-sm text-zinc-600">
                          {step.travelMode === 'TRANSIT'
                            ? `${step.transitDetails?.transitLine?.nameShort || 'Transit'} · ${step.localizedValues?.distance?.text}`
                            : `Walk ${step.localizedValues?.distance?.text}`
                          }
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <SafeAreaView className="absolute bottom-0 w-full px-4">
        <Link asChild href="/(protected)">
          <Text weight="bold" className="text-white text-lg w-full bg-blue-500 py-3 text-center rounded-lg">
            Finish
          </Text>
        </Link>
      </SafeAreaView>

    </View>
  )
}