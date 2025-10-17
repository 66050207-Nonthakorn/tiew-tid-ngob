import { Link } from "expo-router";
import { View, Text } from "react-native";

export default function LoginPage() {
  return (
    <View>
      <Link href="/(protected)" replace>
        go to
      </Link>
    </View>
  );
}