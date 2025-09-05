import { useOAuth, useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import React from 'react'
import { Text, TextInput, TouchableOpacity,View,Alert} from 'react-native'
import { makeRedirectUri } from 'expo-auth-session'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;
    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // Sign in process is complete and redirect user 
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
      } else {
        // If user is not signed up for app then 
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // Always surface a helpful alert to the user
      try {
        const anyErr = err as any
        const status = anyErr?.status
        const code = anyErr?.errors?.[0]?.code
        const message = anyErr?.errors?.[0]?.message

        if (status === 422 && code === 'form_identifier_not_found') {
          Alert.alert('Account not found', 'Please sign up in order to log in.')
        } else if (status === 401 || code === 'form_password_incorrect') {
          Alert.alert('Incorrect credentials', 'The email or password is incorrect.')
        } else if (message) {
          Alert.alert('Sign in failed', String(message))
        } else {
          Alert.alert('Sign in failed', 'Something went wrong. Please try again.')
        }
      } catch {
        Alert.alert('Sign in failed', 'Something went wrong. Please try again.')
      } finally {
        console.error(JSON.stringify(err, null, 2))
      }
    }
  }

  const onGoogleSignInPress = async () => {
    if (!isLoaded) return
    try {
      const redirectUrl = makeRedirectUri({ scheme: 'alert' })
      const { createdSessionId } = await startOAuthFlow({ redirectUrl })
      if (createdSessionId) {
        await setActive({ session: createdSessionId })
        router.replace('/')
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <View>
      <Text>Sign in</Text>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <TouchableOpacity onPress={onSignInPress}>
        <Text>Continue</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onGoogleSignInPress}>
        <Text>Continue with Google</Text>
      </TouchableOpacity>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
        <Link href="/sign-up">
          <Text>Sign up</Text>
        </Link>
      </View>
    </View>
  )
}