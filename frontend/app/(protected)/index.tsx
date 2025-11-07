import { View, TextInput, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/Text";
import { Link } from "expo-router";
import { useState } from "react";

export default function HomePage() {
  const [budget, setBudget] = useState("");

  return (
    <View className="relative size-full">
      <KeyboardAvoidingView
        behavior="padding"
        className="size-full flex items-center justify-center gap-6 grow bg-white"
      >
        <Text weight="bold" className="text-[32px] text-center">
          Let&apos;s travel today
        </Text>
        
        <View className="w-full flex gap-2 px-12">
          <TextInput
            style={{ fontFamily: "NunitoSans" }}
            placeholder="Type your budget..."
            value={budget}
            onChangeText={setBudget}
            keyboardType="numeric"
            className="border-2 border-zinc-500 px-4 py-3 rounded-full w-full text-center"
          />

          <Link
            disabled={!budget}
            href={{
              pathname: "/(protected)/SearchResult",
              params: { budget }
            }}
            asChild
          >
            <TouchableOpacity
              className={`w-full py-3 rounded-full ${!!budget ? "bg-zinc-800" : "bg-zinc-300"}`}
            >
              <Text className="text-center text-white">
                Generate
              </Text>
            </TouchableOpacity>
          </Link>

        </View>
      </KeyboardAvoidingView>
    </View>
  );
}