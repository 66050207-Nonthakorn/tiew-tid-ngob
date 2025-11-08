import { Text } from "@/components/ui/Text"
import TripCard from "@/components/ui/TripCard";
import { fetchProfile } from "@/lib/profile";
import { fetchTrips } from "@/lib/trip";
import { useAuthStore } from "@/store/auth";
import { Trip } from "@/types/trip";
import { Profile } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfilePage() {
  const { signOut } = useAuthStore();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      const profile = await fetchProfile();
      setProfile(profile);

      const trips = await fetchTrips();
      setTrips(trips);
    })();
  }, []);

  return (
    <SafeAreaView className="bg-white size-full px-6">
      <View className="flex-row justify-between items-center gap-2 w-full px-2">
        <View className="flex-row items-center gap-2">
          <Ionicons
            name="person-circle-outline"
            size={42}
          />

          {profile ? (
            <View>
              <Text weight="bold" className="text-xl">
                {profile?.name}
              </Text>
              <Text weight="semibold" className="text-sm">
                {profile?.email}
              </Text>
            </View>
            ) : <ActivityIndicator />
          }
        </View>

        <Pressable onPressIn={() => signOut()}>
          <Text
            weight="bold"
            className="text-red-500 border border-zinc-200 py-2 px-3 rounded-full"
          >
            Sign Out
          </Text>
        </Pressable>
      </View>

      <View className="mt-8">
        <Text weight="semibold" className="text-lg">
          Trip history
        </Text>

        {trips.length === 0 &&
          <Text className="self-center mt-4 text-sm">
            looks like you didn&apos;t travel to any place 
          </Text>
        }
        
        <ScrollView className="py-4 mb-24">
          <View className="gap-4 pb-4">
            {trips
              .sort((a, b) => b.startAt.localeCompare(a.startAt))
              .map((trip, index) =>
                <TripCard
                  key={index}
                  trip={trip}
                />
            )}
          </View>
        </ScrollView>
      </View>

    </SafeAreaView>
  );
}
