import {useSignIn ,useSignUp } from '@clerk/clerk-expo'
import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View, Image, Alert, Pressable, Keyboard} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Login from '@/app/components/Auth/Login'
import oneTimePassword from '@/app/components/Auth/oneTimePassword'
import { useGoogleAuth } from '@/app/functions/auth/googleAuth'
import GoogleAuthBar from '@/app/components/Auth/GoogleAuthBar'

export default function Page() {

  

  // // Google Auth
  // const {onGoogleAuth}=useGoogleAuth()

  // if(!(isLoadedSignIn && isLoadedSignUp)){
  //   return null
  // }

  // return (
  //     <KeyboardAwareScrollView
  //       contentContainerStyle={{ flexGrow: 1 }}
  //       enableOnAndroid={true}
  //       extraScrollHeight={150}   // pushes content a bit more above keyboard
  //       keyboardShouldPersistTaps="handled"
  //       showsVerticalScrollIndicator={false}
  //       className='bg-black'
  //     >
  //         <View className='mt-[9vh] mb-[5vh]'>
  //            <Text className='font-extrabold text-gray-100 text-8xl italic mx-auto mt-[5rem] '>NOTIFY</Text>
             
  //           {!pendingVerification ? (
  //           ) : (
            
  //           <View className='w-[85vw] mx-auto mt-10'
  //               style={{
  //               borderBottomColor: '#ccc', 
  //               borderBottomWidth: 3,      
  //               marginVertical: 10,      
  //             }}/>

  //           <View className='w-[15%] bg-black self-center bottom-[1.8rem] '>
  //           <Text className='bg-black text-gray-100 mx-auto text-xl'>or</Text>
  //           </View>
  //           <GoogleAuthBar />
  //           <Login />
            
            
  //           {reset && <TouchableOpacity className=' w-[35%] h-[5%] self-end mr-8 px-1 py-1'>
  //             <Text className='text-red-400 italic'>Forgot Password?</Text></TouchableOpacity>}

  //           <TouchableOpacity  onPress={()=>{onSignInPress();}}
  //                   className='h-[3rem] w-[52.5vw] mt-3 bg-gray-100 self-center align-middle justify-center rounded-2xl'>
  //             <Text className='font-bold italic mx-auto text-xl'>Login</Text>
  //           </TouchableOpacity>
  //           </>
  //         ) }
  //       </View>

  //     </KeyboardAwareScrollView>)
return(
  <View>
    <Text>Reworking this section to make this modular and smaller packages for future error handling and resuing and debugging</Text>
  </View>
    );
  }