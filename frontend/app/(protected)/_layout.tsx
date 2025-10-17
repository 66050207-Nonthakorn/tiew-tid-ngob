import { Tabs } from "expo-router";
import Octicons from '@expo/vector-icons/Octicons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 75,
          paddingTop: 8,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }: { color: string }) => (
            <Octicons
              name="home"
              size={28}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }: { color: string }) => (
            <Octicons
              name="gear"
              size={28}
              color={color}
            />
          )
        }}
      />
    </Tabs>
  );
}
