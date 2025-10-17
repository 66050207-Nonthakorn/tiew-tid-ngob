import { Link } from 'expo-router'
import { View } from 'react-native'

export default function AuthIndexPage() {
  return (
    <View>
      <Link href="/(protected)" replace className='p-20'>
        go to
      </Link>
    </View>
  )
}