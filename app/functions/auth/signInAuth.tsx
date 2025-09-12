import {type SignInResource} from '@clerk/types'

interface onSignInHelperProps{
  signIn:SignInResource | undefined,
  emailAddress:string,
  password:string
}

interface sendResendCodeHelperProps{
  isLoadedSignIn:boolean,
  signIn:SignInResource | undefined,
  emailAddress:string
}

interface verifyResetCodeHelperProps{
  isLoadedSignIn:boolean,
  signIn:SignInResource | undefined,
  code:string,
  newPassword:string
}

export async function onSignInPressHelper({signIn,emailAddress,password}:onSignInHelperProps){
    // Start the sign-in process using the email and password provided
      const signInAttempt = await (signIn as SignInResource).create({
        identifier: emailAddress,
        password,
      })
      // Sign in process is complete and redirect user 
      if (signInAttempt.status === 'complete') {
        return signInAttempt
      }
        // If user is not signed up for app then 
      return null
    } 


 export async function sendResetCodeHelper({isLoadedSignIn,signIn,emailAddress}:sendResendCodeHelperProps){
    if(!isLoadedSignIn){return null}
    try {
      await (signIn as SignInResource).create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      });
      console.log("Reset code sent to email");
    } catch (err) {
      console.error("Error sending reset code:", err);
    }
  }

  export async function verifyResetPasswordHelper({isLoadedSignIn,signIn,code,newPassword}:verifyResetCodeHelperProps){
    if(!isLoadedSignIn){return null}
    try {
      const result = await (signIn as SignInResource).attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,                // code user enters from email
        password: newPassword,
      });
  
      if (result.status === "complete") {
        console.log("Password reset successful!");
      } else {
        console.log("Still pending:", result);
      }
    } catch (err) {
      console.error("Error verifying reset code:", err);
    }
  }