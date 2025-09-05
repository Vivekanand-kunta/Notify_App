import { useOAuth, useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import * as React from 'react'
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { makeRedirectUri } from 'expo-auth-session'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // Always surface a helpful alert to the user
      try {
        const anyErr = err as any
        const status = anyErr?.status
        const code = anyErr?.errors?.[0]?.code
        const message = anyErr?.errors?.[0]?.message

        if (status === 422 && code === 'form_identifier_exists') {
          Alert.alert('Email already in use', 'Try signing in instead.')
        } else if (message) {
          Alert.alert('Sign up failed', String(message))
        } else {
          Alert.alert('Sign up failed', 'Something went wrong. Please try again.')
        }
      } catch {
        Alert.alert('Sign up failed', 'Something went wrong. Please try again.')
      } finally {
        console.error(JSON.stringify(err, null, 2))
      }
    }
  }

  const onGoogleSignUpPress = async () => {
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

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If user is not signed up for app then 
        console.log(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // Show a clear alert and avoid unsafe property access
      try {
        const anyErr = err as any
        const status = anyErr?.status
        const code = anyErr?.errors?.[0]?.code
        const message = anyErr?.errors?.[0]?.message

        if (status === 422 && code === 'form_identifier_exists') {
          Alert.alert('Email already in use', 'Try signing in instead.')
        } else if (message) {
          Alert.alert('Verification failed', String(message))
        } else {
          Alert.alert('Verification failed', 'Please check the code and try again.')
        }
      } catch {
        Alert.alert('Verification failed', 'Please check the code and try again.')
      } finally {
        console.error(JSON.stringify(err, null, 2))
      }
    }
  }

  if (pendingVerification) {
    return (
      <>
        <Text>Verify your email</Text>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <TouchableOpacity onPress={onVerifyPress}>
          <Text>Verify</Text>
        </TouchableOpacity>
      </>
    )
  }

  return (
    <View>
      <>
        <Text>Sign up</Text>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(email) => setEmailAddress(email)}
        />
        <TextInput
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity onPress={onSignUpPress}>
          <Text>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onGoogleSignUpPress}>
          <Text>Continue with Google</Text>
        </TouchableOpacity>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
          <Text>Already have an account?</Text>
          <Link href="/sign-in">
            <Text>Sign in</Text>
          </Link>
        </View>
      </>
    </View>
  )
}