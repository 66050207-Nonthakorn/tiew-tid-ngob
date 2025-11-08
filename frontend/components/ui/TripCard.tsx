import { View } from "react-native";
import { Text } from "./Text";
import { Trip } from "@/types/trip";

interface TripCardProps {
  trip: Trip
}

export default function TripCard({ trip }: TripCardProps) {
  const startDate = new Date(trip.startAt);
  const endDate = new Date(trip.endAt);

  return (
    <View className="w-full bg-white rounded-lg justify-evenly items-start border border-zinc-500 px-3 py-2">
      <View className="flex-row">
        <Text className="w-12">From</Text>
        <Text weight="bold">
          {trip.places[0]?.place.name ?? "-"}
        </Text>
      </View>
      <Text className="text-xs">
        {startDate.toLocaleString()}
      </Text>

      <View className="flex-row mt-2">
        <Text className="w-12">To</Text>
        <Text weight="bold">
          {trip.places[trip.places.length-1]?.place.name ?? "-"}
        </Text>
      </View>
      <Text className="text-xs">
        {endDate.toLocaleString()}
      </Text>
    </View>
  );
}