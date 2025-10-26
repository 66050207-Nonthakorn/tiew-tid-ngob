import { View, TextInput, KeyboardAvoidingView, TouchableOpacity } from "react-native";

import { Text } from "@/components/ui/Text";
import { Link } from "expo-router";

export default function HomePage() {
  return (
    <View className="relative size-full">
      <KeyboardAvoidingView
        behavior="padding"
        className="size-full flex items-center justify-center gap-6 grow bg-white"
      >
        <Text weight="bold" className="text-[32px] text-center">
          Let&apos;s travel today
        </Text>
        <View className="w-full flex gap-4 px-12">
          <TextInput
            style={{ fontFamily: "NunitoSans" }}
            placeholder="Type your budget..."
            className="border-2 border-zinc-300 px-4 rounded-full w-full"
            keyboardType="numeric" // This displays a numeric keypad
          />
          <Link href="/(protected)/SearchResult" asChild>
            <TouchableOpacity
              className="w-full py-3 bg-zinc-800 rounded-full"
            >
              <Text className="text-center text-white">
                Go !
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}