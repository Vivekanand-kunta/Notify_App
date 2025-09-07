import { useOAuth, useSignIn ,useSignUp } from '@clerk/clerk-expo'
import { useRouter} from 'expo-router'
import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View, Image, Alert, Pressable, Keyboard} from 'react-native'
import { makeRedirectUri } from 'expo-auth-session'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function Page() {
  
  
  const router = useRouter()
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })
  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  // Sign in details
  const { signIn, setActive:setActiveSignIn, isLoaded:isLoadedSignIn } = useSignIn()
  const [reset, setReset]=React.useState(false)

  // Sign up details 
  const {signUp ,setActive:setActiveSignUp, isLoaded: isLoadedSignUp } = useSignUp()
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  // Google Sign in / Sign up just a single click 
  const onGoogleAuth = async () => {
    if (!isLoadedSignIn) return
    try {
      const redirectUrl = makeRedirectUri({ scheme: 'alert' })
      const { createdSessionId } = await startOAuthFlow({ redirectUrl })
      if (createdSessionId) {
        await setActiveSignIn({ session: createdSessionId })
        router.replace('/')
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }
  
  // Sign in and Sign up custome error handling and management 
  const onSignInPress = async () => {
    if (!isLoadedSignIn) return;
    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })
      // Sign in process is complete and redirect user 
      if (signInAttempt.status === 'complete') {
        await setActiveSignIn({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If user is not signed up for app then 
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: unknown) {
      // Prefer: import { isClerkAPIResponseError } from '@clerk/clerk-expo'
      const e = err as any
      const code = e?.errors?.[0]?.code
      const status = e?.status

      if (status === 422 && code === 'form_identifier_not_found') {
        onSignUpPress()
      } else if (status === 422 && code === 'form_password_incorrect') {
        setReset(true)
        Alert.alert('Incorrect password', 'Please try again or reset it.')
      } else if (status === 422 && code === 'form_param_format_invalid') {
        Alert.alert('Invalid input', 'Please check your credentials.')
      }
      else if(status === 400 && code === 'strategy_for_user_invalid'){
        Alert.alert("Oops","You have used other authentication method \n \n Please try another method")
      } 
      else {
        console.error(JSON.stringify(err,null,2))
      }
    }
  }
  // Sign up functionality and checking up for Email verification through otp
  const onSignUpPress = async () => {
    if (!isLoadedSignUp) return
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
      console.error(JSON.stringify(err, null, 2))
      }
  }
  
  const onVerifyPress = async () => {
    if (!isLoadedSignUp) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActiveSignUp({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If user is not signed up for app then 
        console.log(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // Show a clear alert and avoid unsafe property access
      const e = err as any
      const code = e?.errors?.[0]?.code
      const status = e?.status

      if(status===422 && code==="form_code_incorrect"){
        Alert.alert("Invalid Authentication Code","PLease check your code and retry again")
      }
      else if(status===400 && code==="verification_failed"){
        setPendingVerification(!pendingVerification)
      }
      else if(status===429 && code==="too_many_requests"){
        Alert.alert("Too Many Requests",`Try again in ${e?.retryAfter} sec \nTry changing your network if this persists`)
        setPendingVerification(!pendingVerification)
      }
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const onResendPress = async () => {
    if (!isLoadedSignUp) return
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      Alert.alert('Code sent', 'We emailed you a new verification code.')
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
      Alert.alert('Error', 'Unable to resend code. Please try again later.')
    }
  }


  if(!(isLoadedSignIn && isLoadedSignUp)){
    return null
  }

  return (
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={150}   // pushes content a bit more above keyboard
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        className='bg-black'
      >
          <View className='mt-[9vh] mb-[5vh]'>
             <Text className='font-extrabold text-gray-100 text-8xl italic mx-auto mt-[5rem] '>NOTIFY</Text>
             
            {pendingVerification ? (
                <Pressable onPress={Keyboard.dismiss} accessible={false}>
                <Text className='text-gray-100 italic mb-2 text-xl text-center mt-[5rem]'>Verify your email</Text>
                <Text className='text-gray-400 text-center mb-6'>Enter the 6-digit code we sent</Text>
                <TextInput
                  value={code}
                  keyboardType="number-pad"
                  placeholder="XXX XXX"
                  onChangeText={(code) =>{
                    if(code.length<6){
                      setCode(code);
                    }
                    else if(code.length===6){
                      setCode(code);Keyboard.dismiss();}
                    
                    }}
                  className=' bg-gray-100 w-[85vw] h-[3.5rem] rounded-2xl px-5 py-2 mx-auto text-4xl text-center font-bold italic '
                />
                <TouchableOpacity onPress={onVerifyPress}>
                  <Text className="h-[3rem] w-[50vw] mt-6 self-center align-middle justify-center
                   rounded-2xl text-center text-3xl font-bold italic bg-gray-100">Verify</Text>
                </TouchableOpacity>

                <View className='flex-row items-center justify-center mt-3'>
                  <Text className='text-gray-400'>{"Didn't get the code?"}</Text>
                  <TouchableOpacity onPress={onResendPress}>
                    <Text className='text-gray-100 underline ml-1'>Resend</Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
  

            ) : (
              <>
             <Image source={require('../../assets/images/panda-hi-back.png')} 
               className="w-32 h-32 mx-auto mt-4"
               resizeMode="contain"
             />

            <TouchableOpacity onPress={onGoogleAuth}
                  className="flex-row items-center justify-evenly bg-gray-100 border
                          border-gray-300 rounded-3xl w-[85vw]  py-4  mx-auto">
                  <Image 
                    source={require('../../assets/icons/google.png')} 
                    className="w-9 h-9 right-1.125 bg-transparent"
                    resizeMode="contain"
                  />
                  <Text className="text-xl italic font-semibold text-justify">Continue with Google</Text>
            </TouchableOpacity>
            
            <View className='w-[85vw] mx-auto mt-10'
                style={{
                borderBottomColor: '#ccc', 
                borderBottomWidth: 3,      
                marginVertical: 10,      
              }}/>

            <View className='w-[15%] bg-black self-center bottom-[1.8rem] '>
            <Text className='bg-black text-gray-100 mx-auto text-xl'>or</Text>
            </View>


            <View className=' flex-col '>
                  <TextInput className='self-center italic m-2.5 bg-gray-100 w-[85vw] px-4 rounded-2xl font-medium
                        border-2 border-blue-50 overflow-x-auto no-scrollbar'
                        autoCapitalize="none"
                        value={emailAddress}
                        placeholder="Email"
                        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                  />

                  <TextInput className='self-center italic m-2.5 bg-gray-100 w-[85vw] px-4 rounded-2xl font-medium
                        border-2 border-blue-50 overflow-x-auto no-scrollbar'
                        autoCapitalize="none"
                        value={password}
                        placeholder="Password"
                        secureTextEntry={true}
                        onChangeText={(password) => setPassword(password)}
                  />
            </View>

            <TouchableOpacity  onPress={()=>{onSignInPress();}}
                    className='h-[3rem] w-[82.5vw] mt-3 bg-gray-100 self-center align-middle justify-center rounded-2xl'>
              <Text className='font-bold italic mx-auto text-xl'>Continue</Text>
            </TouchableOpacity>
            </>
          ) }
        </View>
      </KeyboardAwareScrollView>
    )
  }