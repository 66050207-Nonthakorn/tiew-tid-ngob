import { Tabs } from "expo-router"

export default function ProtectedLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: "Tiew Tid Ngob"
        }}
      />
      <Tabs.Screen
        name="Plans"
        options={{
        }}
      />
      <Tabs.Screen
        name="Settings"
      />
    </Tabs>
  )
}
