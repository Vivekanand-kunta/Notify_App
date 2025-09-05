import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Text, View } from 'react-native'
import SignOutButton from '@/app/components/SignOutButton'

export default function Page() {
  const {user } = useUser()
 
  return (
    <View>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <Link href="/(home)/notification" ><Text>Move to Notifications</Text></Link>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <Link href="/(auth)/sign-in" >
          <Text className='w-20 h-20 bg-green-500'>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up" >
          <Text className='w-20 h-20 bg-red-500'>Sign up</Text>
        </Link>
        <View><Text>Hello this is Vivek</Text></View>
      </SignedOut>
    </View>
  )
}