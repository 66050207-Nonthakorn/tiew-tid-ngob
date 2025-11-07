import { View } from "react-native";
import { Text } from "./Text";

interface TripCardProps {
  source: string,
  destination: string,
}

export default function TripCard({ source, destination }: TripCardProps) {
  return (
    <View className="flex-row h-20 w-full bg-white rounded-lg justify-evenly items-center border border-zinc-300">
      <Text weight="semibold">
        {source}
      </Text>
      <Text>{"->"}</Text>
      <Text weight="semibold">
        {destination}
      </Text>
    </View>
  );
}