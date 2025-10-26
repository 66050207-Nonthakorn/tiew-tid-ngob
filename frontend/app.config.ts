import { ExpoConfig } from "expo/config";

export default ({ config }: { config: ExpoConfig }) => ({
    ...config,
    plugins: [
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": "com.googleusercontent.apps.595523714235-f5ucapqkfaih3hqcnpi06jhiu7t9kjc1"
        }
      ]
    ]
})