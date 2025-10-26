import { Link } from "expo-router"
import { Pressable, View } from "react-native"
import * as WebBrowser from "expo-web-browser";
import { Text } from "@/components/ui/Text";
import {
  GoogleSignin,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  iosClientId: "595523714235-f5ucapqkfaih3hqcnpi06jhiu7t9kjc1.apps.googleusercontent.com",
});

export default function AuthIndexPage() {
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      // if (isSuccessResponse(response)) {
      //   // sign in was success
      // } else {
      //   // sign in was cancelled by user
      // }
    }
    catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    await GoogleSignin.signOut();
  };

  return (
    <View>
      <Link href="/(protected)" replace className="p-20">
        go to
      </Link>
      <Pressable onPress={() => signIn()}>
        <Text>Login</Text>
      </Pressable>
      <Pressable onPress={() => signOut()}>
        <Text>Logout</Text>
      </Pressable>
    </View>
  )
}