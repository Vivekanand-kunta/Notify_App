import { useAuth } from '@clerk/clerk-expo'
import { Redirect, Stack } from 'expo-router'
import { AuthProvider } from '@/app/functions/auth/authStore'
export default function AuthLayout() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Redirect href={'/'} />
  }

  return (
    <AuthProvider>
    <Stack screenOptions={{headerShown:false}}>
      <Stack.Screen name="sign-in" options={{ animation: "slide_from_left" }} />
    </Stack>
    </AuthProvider>
  )
}