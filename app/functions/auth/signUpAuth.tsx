import { Alert } from "react-native"
import {type SignUpResource,type SetActive} from '@clerk/types'

interface onResendCodePressHelperProps{
  isLoadedSignUp:boolean,
  signUp:SignUpResource | undefined,
}

interface onClickVerifySignUpPressHelperProps{
  signUp:SignUpResource|undefined,
  code:string,
  setPendingVerification: React.Dispatch<React.SetStateAction<boolean>>,
  setActiveSignUp:SetActive | undefined,
  pendingVerification:boolean
}

interface onSignUpPressHelperProps{
  signUp:SignUpResource|undefined,
  isLoadedSignUp:boolean,
  emailAddress:string,
  password:string,
  setPendingVerification:React.Dispatch<React.SetStateAction<boolean>>,
}

export async function onResendCodePressHelper({isLoadedSignUp,signUp}:onResendCodePressHelperProps){
    if (!isLoadedSignUp) return
    try {
      await (signUp as SignUpResource).prepareEmailAddressVerification({ strategy: 'email_code' })
      Alert.alert('Code sent', 'We emailed you a new verification code.')
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
      Alert.alert('Error', 'Unable to resend code. Please try again later.')
    }
  }

export async function onClickVerifySignUpPressHelper({signUp,code,setPendingVerification,pendingVerification,setActiveSignUp}:onClickVerifySignUpPressHelperProps){
    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await (signUp as SignUpResource).attemptEmailAddressVerification({
        code,
      })
      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await (setActiveSignUp as SetActive)({ session: signUpAttempt.createdSessionId })
        return true
      } else {
        // If user is not signed up for app then 
        console.log(JSON.stringify(signUpAttempt, null, 2))
        return false
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

export async function onSignUpPressHelper({isLoadedSignUp,emailAddress,password,signUp,setPendingVerification}:onSignUpPressHelperProps){
    if (!isLoadedSignUp) return
    // Start sign-up process using email and password provided
    try {
      await (signUp as SignUpResource).create({
        emailAddress,
        password,
      })
      // Send user an email with verification code
      await (signUp as SignUpResource).prepareEmailAddressVerification({ strategy: 'email_code' })
      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // Always surface a helpful alert to the user
      console.error(JSON.stringify(err, null, 2))
      }
  }