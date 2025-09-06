import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import SignedInChecker from '@/app/components/FunctionalUnits/SignedInChecker'

export default function HomeLayout(){
  return (
    <SignedInChecker >
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
    </SignedInChecker> 
  )
}
