import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import SignedInChecker from '../components/SignedInChecker'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeLayout(){
  return (
    <SignedInChecker >
      <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          headerShown: false,
        }}
      >
        <Tabs.Screen 
          name='index' 
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen 
          name='notification' 
          options={{
            title: 'Notifications',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="notifications" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      </SafeAreaView>
    </SignedInChecker> 
  )
}
