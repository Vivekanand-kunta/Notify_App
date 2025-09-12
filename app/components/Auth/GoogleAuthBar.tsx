import { Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useGoogleAuth } from '@/app/functions/auth/googleAuth'

const GoogleAuthBar = () => {
  const {onGoogleAuth}=useGoogleAuth();
  return (
    <TouchableOpacity onPress={() => onGoogleAuth()}
        className="flex-row items-center justify-evenly bg-gray-100 border
                border-gray-300 rounded-3xl w-[85vw]  py-4  mx-auto mt-20">
        <Image 
        source={require('../../assets/icons/google.png')} 
        className="w-9 h-9 right-1.125 bg-transparent"
        resizeMode="contain"
        />
        <Text className="text-xl italic font-semibold text-justify">Continue with Google</Text>
    </TouchableOpacity>
  )
}

export default GoogleAuthBar