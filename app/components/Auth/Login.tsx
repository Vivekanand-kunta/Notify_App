import { useState } from 'react'
import { View,TextInput,TouchableOpacity,} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const Login = () => {
const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className=' flex-col '>
                  <View className='bg-transparent w-[80%] mx-auto'>
                  <TextInput className='self-center italic  bg-gray-100 w-[100%] mx-5 px-7 rounded-2xl font-medium
                        border-2 border-blue-50 overflow-x-auto no-scrollbar'
                        autoCapitalize="none"
                        value={emailAddress}
                        autoComplete="email"
                        textContentType="emailAddress"
                        placeholder="Email"
                        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                  />
                  </View>

                  <View className="self-center flex-row items-center m-2.5 bg-gray-100 w-[81vw] pl-5 pr-4 rounded-2xl border-2 border-blue-50">
                        <TextInput
                          className="flex-1 italic font-medium"
                          autoCapitalize="none"
                          value={password}
                          placeholder="Password"
                          secureTextEntry={!showPassword} // toggle here
                          onChangeText={setPassword}
                        />

                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                          <Ionicons
                            name={showPassword ? "eye-off" : "eye"}
                            size={24}
                            color="gray"
                            className='mr-1'
                          />
                        </TouchableOpacity>
                    </View>
            </View>
  )
}

export default Login;