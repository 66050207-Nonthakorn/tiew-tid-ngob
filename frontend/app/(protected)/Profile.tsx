import { Text } from "@/components/ui/Text"
import { fetchProfile } from "@/lib/profile";
import { useAuthStore } from "@/store/auth";
import { Profile } from "@/types/user";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfilePage() {
  const { signOut } = useAuthStore();

  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {

    (async () => {
      const profile = await fetchProfile();
      setProfile(profile);
    })();

  }, []);

  return (
    <SafeAreaView className="bg-white size-full items-center">
      <Text weight="bold" className="text-2xl">
        {profile?.name}
      </Text>
      <Text weight="semibold">
        {profile?.email}
      </Text>
      <Pressable
        onPressIn={() => signOut()}
        className="border-y border-zinc-200 w-full items-center py-3 mt-4 justify-self-end"
      >
        <Text weight="bold" className="text-red-500 text-xl">
          Sign Out
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
