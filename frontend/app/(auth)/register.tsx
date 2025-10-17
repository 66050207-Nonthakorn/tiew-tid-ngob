import { Link } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

export default function RegisterPage() {
  return (
    <SafeAreaView className="size-full flex justify-center items-center">
      <Link href="/login">
        login
      </Link>
    </SafeAreaView>
  )
}