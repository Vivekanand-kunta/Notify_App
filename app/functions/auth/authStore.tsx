import {createContext,ReactNode, useContext, useState} from 'react'
import { useSignIn,useSignUp } from '@clerk/clerk-expo';
import type { SetActive, SignInResource, SignUpResource } from "@clerk/types";
import { onSignInPressHelper,sendResetCodeHelper,verifyResetPasswordHelper } from '@/app/functions/auth/signInAuth';
import { onSignUpPressHelper,onResendCodePressHelper,onClickVerifySignUpPressHelper} from '@/app/functions/auth/signUpAuth';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

interface AuthContextType {
  signIn: SignInResource | undefined;
  signUp: SignUpResource | undefined;
  emailAddress:string;
  setEmailAddress:React.Dispatch<React.SetStateAction<string>>;
  password:string;
  setPassword:React.Dispatch<React.SetStateAction<string>>
  setActiveSignIn: SetActive | undefined;
  setActiveSignUp: SetActive | undefined;
  isLoadedSignIn: boolean;
  isLoadedSignUp: boolean;
  onSignInPress:()=>Promise<void>;
  sendResetCode:()=>Promise<void>;
  verifyResetPassword:()=>Promise<void>;
  onResendCodePress:()=>Promise<void>;
  onClickVerifySignUp:()=>Promise<void>;
  setNewPassword:React.Dispatch<React.SetStateAction<string>>;
  setCode:React.Dispatch<React.SetStateAction<string>>,
  reset:boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider=({children}:{children:ReactNode})=>{

    const { signIn, setActive:setActiveSignIn, isLoaded:isLoadedSignIn } = useSignIn()
    const { signUp, setActive:setActiveSignUp, isLoaded:isLoadedSignUp } = useSignUp()
    const [emailAddress,setEmailAddress]=useState('')
    const [password,setPassword]=useState('')
    const [newPassword, setNewPassword]=useState('')
    const [reset, setReset]=useState(false)
    const [pendingVerification, setPendingVerification] = useState(false)
    const [code, setCode] = useState('')

    const router=useRouter();

    // Sign in functions
    const onSignInPress=async()=>{
        if (!isLoadedSignIn) return;
        try{
            const signInAttempt=await onSignInPressHelper({signIn,emailAddress,password});
            if(signInAttempt && signInAttempt.createdSessionId){
                await setActiveSignIn({ session: signInAttempt.createdSessionId  })
                router.push('/')
            }
            else{console.error(JSON.stringify(signInAttempt, null, 2));}
        }
        catch (err: unknown) {
            const e = err as any
            const code = e?.errors?.[0]?.code
            const status = e?.status
      
            if (status === 422 && code === 'form_identifier_not_found') {
              onSignUpPress()
            } else if (status === 422 && code === 'form_password_incorrect') {
              setReset(true)
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
    const sendResetCode=async()=>{await sendResetCodeHelper({isLoadedSignIn,signIn,emailAddress});}
    const verifyResetPassword=async()=>{await verifyResetPasswordHelper({isLoadedSignIn,signIn,code,newPassword}); }
    
    // Sign Up functions 
    const onResendCodePress=async()=>{await onResendCodePressHelper({isLoadedSignUp,signUp});}
    const onClickVerifySignUp=async()=>{
        const res=await onClickVerifySignUpPressHelper({signUp,code,setPendingVerification,pendingVerification,setActiveSignUp});
        if(res){router.push('/');}
            }
    const onSignUpPress=async()=>{await onSignUpPressHelper({isLoadedSignUp,emailAddress,password,signUp,setPendingVerification});}
    
    return (
    <AuthContext.Provider
        value={{signIn,signUp,setActiveSignIn,setActiveSignUp,
                emailAddress,setEmailAddress,password,setPassword,
                isLoadedSignIn,isLoadedSignUp,onSignInPress,sendResetCode,
                verifyResetPassword,onResendCodePress,onClickVerifySignUp,
                reset,setNewPassword,setCode}}>
        {children}
    </AuthContext.Provider>)
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
  };