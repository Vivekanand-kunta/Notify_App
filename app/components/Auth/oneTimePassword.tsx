import { View, Text,Pressable,TextInput,TouchableOpacity,Keyboard } from 'react-native'
import React from 'react'

interface oneTimePasswordProps{
    code:string,
    setCode:React.Dispatch<React.SetStateAction<string>>,
    onResendPress: () => Promise<void>,
    onVerifyPress: () => Promise<void>,
}
const oneTimePassword = ({code,setCode,onResendPress,onVerifyPress}:oneTimePasswordProps) => {

    
  return (
    <Pressable onPress={Keyboard.dismiss} accessible={false}>
                <Text className='text-gray-100 italic mb-2 text-xl text-center mt-[5rem]'>Verify your email</Text>
                <Text className='text-gray-400 text-center mb-6'>Enter the 6-digit code we sent</Text>
                <TextInput
                  value={code}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  autoComplete="one-time-code"
                  placeholder="XXX-XXX"
                  maxLength={6}
                  onChangeText={(value) => {
                    const digitsOnly = value.replace(/\D/g, '').slice(0, 6)
                    setCode(digitsOnly)
                    if (digitsOnly.length === 6) Keyboard.dismiss()
                  }}
                  className='bg-gray-100 w-[85vw] h-[3.5rem] rounded-2xl px-5 py-2 mx-auto text-4xl text-center font-bold italic'
                />
                <TouchableOpacity onPress={() => onVerifyPress()} disabled={code.length !== 6}>
                  <Text className={`h-[3rem] w-[50vw] mt-6 self-center rounded-2xl text-center text-3xl font-bold italic ${code.length === 6 ? 'bg-gray-100' : 'bg-gray-500'}`}>
                    Verify
                  </Text>
                </TouchableOpacity>

                <View className='flex-row items-center justify-center mt-3'>
                  <Text className='text-gray-400'>{"Didn't get the code?"}</Text>
                  <TouchableOpacity onPress={() => onResendPress()}>
                    <Text className='text-gray-100 underline ml-1'>Resend</Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
  )
}

export default oneTimePassword