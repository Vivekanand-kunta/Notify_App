
import { makeRedirectUri } from 'expo-auth-session'
import { useOAuth,} from '@clerk/clerk-expo'
import { useRouter} from 'expo-router'
import {useAuthContext} from '@/app/functions/auth/authStore'

export function useGoogleAuth(){
    const {setActiveSignIn}=useAuthContext()
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })
    const router=useRouter()

    const onGoogleAuth=async(): Promise<void> =>{
        try {
            const redirectUrl = makeRedirectUri({ scheme: 'alert' })
            const { createdSessionId } = await startOAuthFlow({ redirectUrl })
            if (createdSessionId && setActiveSignIn) {
                await setActiveSignIn({ session: createdSessionId })
                router.replace('/')
            }
        } catch (err) {
            console.error(JSON.stringify(err, null, 2))
        }};


    return {onGoogleAuth};
  }