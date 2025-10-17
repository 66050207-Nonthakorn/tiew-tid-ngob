import { Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingTab() {
  return (
    <SafeAreaView>
      <Text>
        {process.env.EXPO_PUBLIC_TEST}
      </Text>
    </SafeAreaView>
  );
}
