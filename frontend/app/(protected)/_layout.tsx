import { Ionicons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";

export default function ProtectedLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Tiew Tid Ngob",
          headerRight: () => (
            <Link href="/(protected)/Profile">
              <Ionicons
                name="person-circle-outline"
                size={32}
              />
            </Link>
          )
        }}
      />
      <Stack.Screen
        name="SearchResult"
        options={{
          title: "Search result"
        }}
      />
      <Stack.Screen
        name="RouteDetail"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Navigation"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HistoryDetail"
      />
    </Stack>
  );
}
