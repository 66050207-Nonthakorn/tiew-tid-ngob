import { Text } from "@/components/ui/Text";
import { useAuthStore } from "@/store/auth";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Pressable, TextInput, View } from "react-native";

export default function SignUpPage() {
  const { passwordSignUp } = useAuthStore();

  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  
  const [error, setError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);

  const router = useRouter();
  
  function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async function onPressSignUp() {
    setError("");
    
    if (!email || !username || !password || !passwordConfirm) {
      setError("Please fill in all fields");
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    
    if (password !== passwordConfirm) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    setIsSigningUp(true);

    try {
      await passwordSignUp(email, username, password);
      Alert.alert("Success", "Account created successfully!");

      setTimeout(() => router.push("/(auth)/SignIn"), 1000);
    }
    catch (e) {
      if (e instanceof Error) {
        setError(e.message || "Something went wrong. Please try again.");
      }
    }
    finally {
      setIsSigningUp(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" className="bg-white size-full">
      <View className="size-full justify-end bg-blue-500">
        <View className="relative bg-white rounded-t-[32px] p-10">
          <Text weight="bold" className="px-8 py-4 text-6xl/normal text-white absolute -top-32">
            Sign Up
          </Text>
          <Text weight="semibold">
            Email
          </Text>
          <TextInput
            placeholder="Enter your email..."
            placeholderTextColor="#CCCCCC"
            onChangeText={(text) => setEmail(text)}
            className={`border-2 ${emailError ? 'border-red-500' : 'border-zinc-200'} p-4 rounded-lg text-black mt-1`}
          />
          {emailError && (
            <Text className="text-red-500 text-sm mt-1">
              {emailError}
            </Text>
          )}
          <Text weight="semibold" className="mt-4">
            Username
          </Text>
          <TextInput
            placeholder="Enter your username..."
            placeholderTextColor="#CCCCCC"
            onChangeText={(text) => setUsername(text)}
            className="border-2 border-zinc-200 p-4 rounded-lg text-black mt-1"
          />
          <Text weight="semibold" className="mt-4">
            Password
          </Text>
          <TextInput
            placeholder="Enter your password..."
            placeholderTextColor="#CCCCCC"
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
            className={`border-2 ${passwordError ? 'border-red-500' : 'border-zinc-200'} p-4 rounded-lg mt-1 text-black`}
          />
          <Text weight="semibold" className="mt-4">
            Confirm Password
          </Text>
          <TextInput
            placeholder="Enter your password again..."
            placeholderTextColor="#CCCCCC"
            secureTextEntry
            onChangeText={(text) => setPasswordConfirm(text)}
            className="border-2 border-zinc-200 p-4 rounded-lg mt-1 text-black"
          />
          {passwordError && (
            <Text weight="regular" className="text-red-500 text-sm mt-1">
              {passwordError}
            </Text>
          )}
          {error && (
            <Text className="text-red-500 text-sm mt-2 text-center">
              {error}
            </Text>
          )}
          
          <Pressable 
            className={`w-full mt-6 py-3.5 rounded-lg ${isSigningUp ? "bg-blue-200" : "bg-blue-600"}`}
            onPress={onPressSignUp}>
            <Text weight="bold" className="text-center text-lg text-white">
              {isSigningUp ? <ActivityIndicator /> : "Sign Up"}
            </Text>
          </Pressable>

          <View className="w-full border-b border-zinc-200 my-6" />

          <Pressable className="w-full py-3.5 border border-blue-600 rounded-lg">
            <Link href="/(auth)/SignIn" replace>
              <Text weight="bold" className="text-center text-lg text-blue-600">
                Already have an account ? Sign In
              </Text>
            </Link>
          </Pressable>

        </View>
      </View>
    </KeyboardAvoidingView>
  );
}