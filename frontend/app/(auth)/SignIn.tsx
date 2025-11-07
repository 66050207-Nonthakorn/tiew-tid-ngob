import { Text } from "@/components/ui/Text";
import { useAuthStore } from "@/store/auth";
import { Link } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Pressable, TextInput, View } from "react-native";

export default function SignInPage() {
  const { passwordSignIn, googleSignIn } = useAuthStore();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

  async function onPressSignIn() {
    if (!username || !password) return;

    setIsSigningIn(true);

    try {
      await passwordSignIn(username, password);
    }
    catch (e) {
      console.error(e);
    }
    finally {
      setIsSigningIn(false); 
    }
  }

  async function onPressGoogleSignIn() {
    try {
      await googleSignIn();
    }
    catch (e) {
      console.error(e);
    }
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="size-full"
    >
      <View className="size-full justify-end bg-blue-500">
        <View className="relative bg-white rounded-t-[32px] px-10 pt-10 pb-12">
          <Text weight="bold" className="px-8 py-4 text-6xl/normal text-white absolute -top-32">
            Sign In
          </Text>
          <Text weight="semibold">
            Email or Username
          </Text>
          <TextInput
            placeholder="Enter your email or username..."
            placeholderTextColor="#CCCCCC"
            onChangeText={(text) => setUsername(text)}
            className="border border-zinc-200 p-4 rounded-lg text-black mt-1"
          />
          <Text weight="semibold" className="mt-4">
            Password
          </Text>
          <TextInput
            placeholder="Enter your password..."
            placeholderTextColor="#CCCCCC"
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
            className="border border-zinc-200 p-4 rounded-lg mt-1 text-black"
          />
          <Pressable
            onPressIn={onPressSignIn}
            className={`w-full mt-6 py-3.5 rounded-lg ${isSigningIn ? "bg-blue-200" : "bg-blue-600"}`}
          >
            <Text weight="bold" className="text-center text-lg text-white">
              {isSigningIn ? <ActivityIndicator /> : "Sign In"}
            </Text>
          </Pressable>

          <View className="w-full border-b border-zinc-200 my-6" />
          
          <Pressable className="w-full py-3.5 border border-blue-600 rounded-lg">
            <Link href="/(auth)/SignUp" replace>
              <Text weight="bold" className="text-center text-lg text-blue-600">
                Don&apos;t have account ? Sign Up
              </Text>
            </Link>
          </Pressable>

          <Pressable onPressIn={onPressGoogleSignIn} className="w-full flex-row mt-2 py-3.5 border rounded-lg gap-2 items-center justify-center">
            <Image source={require("@/assets/google-icon.png")} className="size-7"/>
            <Text weight="bold" className="flex flex-row text-center text-lg">
               Sign In With Google
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}