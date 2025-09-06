import { useUser } from '@clerk/clerk-expo'
import React from 'react'
import { useRouter } from 'expo-router'

export default function SignedInChecker({children}:React.PropsWithChildren){

    const { isSignedIn, isLoaded } = useUser()  
    const router = useRouter()

    if (!isLoaded) return null  

    if (!isSignedIn) {
        router.push('/(auth)/sign-in')
        return null
    }

    return children;
};