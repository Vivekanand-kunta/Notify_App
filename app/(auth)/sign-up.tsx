import { useOAuth, useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import * as React from 'react'
import { Alert, Text, TextInput, TouchableOpacity, View , Image} from 'react-native'
import { makeRedirectUri } from 'expo-auth-session'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

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
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      extraScrollHeight={200}  
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      className='bg-black'
    >
        <View className='mt-[9vh] mb-[5vh]'>
        <Text className='font-extrabold text-gray-100 text-8xl italic mx-auto my-5 '>NOTIFY</Text>
             
             <Image 
               source={require('../../assets/images/panda-hi-back.png')} 
               className="w-32 h-32 mx-auto mt-4"
               resizeMode="contain"
             />
            <TouchableOpacity onPress={onGoogleSignUpPress}
                  className="flex-row items-center justify-evenly bg-gray-100 border
                          border-gray-300 rounded-3xl w-[85vw]  py-4  mx-auto">
                  <Image 
                    source={require('../../assets/icons/google.png')} 
                    className="w-9 h-9 right-1.125 bg-transparent"
                    resizeMode="contain"
                  />
                  <Text className="text-xl italic font-semibold text-justify">Sign up with Google</Text>

            </TouchableOpacity>
            
            <View
                className='w-[85vw] mx-auto mt-10'
                style={{
                borderBottomColor: '#ccc', 
                borderBottomWidth: 3,      
                marginVertical: 10,      
              }}/>

            <View className='w-[15%] bg-black self-center bottom-[1.8rem] '>
            <Text className='bg-black text-gray-100 mx-auto text-xl'>or</Text>
            </View>


            <View className=' flex-col '>
                  <TextInput
                        className='self-center italic m-2.5 bg-gray-100 w-[85vw] px-4 rounded-2xl font-medium
                                   border-2 border-blue-50 overflow-x-auto no-scrollbar'
                        autoCapitalize="none"
                        value={emailAddress}
                        placeholder="Email"
                        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                  />
                  <TextInput
                        className='self-center italic m-2.5 bg-gray-100 w-[85vw] px-4 rounded-2xl font-medium
                                  border-2 border-blue-50 overflow-x-auto no-scrollbar'
                        autoCapitalize="none"
                        value={password}
                        placeholder="Password"
                        secureTextEntry={true}
                        onChangeText={(password) => setPassword(password)}
                  />
            </View>

            <TouchableOpacity  onPress={onSignUpPress}
                    className='h-[3rem] w-[82.5vw] mt-3 bg-gray-100 self-center align-middle justify-center rounded-2xl'>
              <Text className='font-bold italic mx-auto text-xl'>SIGN UP</Text>
            </TouchableOpacity>
            
            <Text className='italic mx-auto text-lg text-gray-100 mt-5'>Already have an account ?
              <Link href='/(auth)/sign-in'>
                <Text className='font-semibold '>SIGN IN</Text>
              </Link> 
            </Text>
        </View>
      </KeyboardAwareScrollView>
  )
}

