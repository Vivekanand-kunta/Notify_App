import { useOAuth, useSignIn } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import React from 'react'
import { Text, TextInput, TouchableOpacity, View, Alert, Image} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { makeRedirectUri } from 'expo-auth-session'
import { Link } from 'expo-router'

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

  if(!isLoaded){
    return null
  }

  return (
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={200}   // pushes content a bit more above keyboard
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
            <TouchableOpacity onPress={onGoogleSignInPress}
                  className="flex-row items-center justify-evenly bg-gray-100 border
                          border-gray-300 rounded-3xl w-[85vw]  py-4  mx-auto">
                  <Image 
                    source={require('../../assets/icons/google.png')} 
                    className="w-9 h-9 right-1.125 bg-transparent"
                    resizeMode="contain"
                  />
                  <Text className="text-xl italic font-semibold text-justify">Sign in with Google</Text>

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
            <TouchableOpacity  onPress={onSignInPress}
                    className='h-[3rem] w-[82.5vw] mt-3 bg-gray-100 self-center align-middle justify-center rounded-2xl'>
              <Text className='font-bold italic mx-auto text-xl'>SIGN IN</Text>
            </TouchableOpacity>
            
            <Text className='italic mx-auto text-lg text-gray-100 mt-5'>{"Don't"} have an account ?
              <Link href='/(auth)/sign-up'>
                <Text className='font-semibold '>SIGN UP</Text>
              </Link> 
            </Text>
        </View>
      </KeyboardAwareScrollView>
    )
  }