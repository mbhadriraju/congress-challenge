import { router } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useAuth } from './context/AuthProvider'


export default function Login({ goToSignup }: any) {
  const [email, changeEmail] = useState('')
  const [password, changePassword] = useState('')
  const [error, setError] = useState('')
  const user = useAuth()
  async function exportData() {
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    const send_data = {
      "email": email.toLowerCase(),
      "password": password
    }
    
    const backendUrl = 'http://kando.govt.hu:5000/login'
    try {
      const sendResponse = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          'Accept': 'application/json'
        },
        body: JSON.stringify(send_data)
      })
      
      const getData = await sendResponse.json()
      
      if (getData.status === 'error') {
        setError(getData.message)
      }
      else if (getData.status === 'success') {
        setError('')
        await user.login(getData.token, getData.user)
        router.replace('/(tabs)')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Network error. Please try again.')
    }
  }
  return (
    <ScrollView 
      className="flex-1 bg-bg px-6" 
      contentContainerStyle={{ flexGrow: 1 }}>
      <View className="pt-20 items-center mb-12">
        <Text className="text-4xl text-text font-bold mb-3 text-center">Welcome Back</Text>
        <Text className="text-textSecondary text-lg text-center">Sign in to continue</Text>
      </View>
      <View className="flex-1 justify-center items-center px-8 mb-52">
        <TextInput
          className="w-full px-5 h-14 text-text font-medium bg-surface border border-surfaceElevated rounded-2xl mb-4"
          placeholder="Email"
          keyboardType="email-address"
          placeholderTextColor="#808080"
          onChangeText={changeEmail}/>
        <TextInput
          className="w-full px-5 h-14 text-text font-medium bg-surface border border-surfaceElevated rounded-2xl"
          placeholder="Password"
          placeholderTextColor="#808080"
          secureTextEntry={true}
          onChangeText={changePassword}/>
        {error !== '' && ( 
          <View className="w-full mt-4 bg-error/20 border border-error rounded-xl p-3">
            <Text className="text-error font-semibold text-sm">{error}</Text>
          </View>
        )}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={exportData}
          className="w-full mt-6 py-4 items-center rounded-2xl bg-primary shadow-lg">
          <Text className="text-white font-bold text-lg">Login</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => goToSignup ? goToSignup() : router.replace('/signup')}
          className="mt-6"
        >
          <Text className="text-secondary font-semibold">Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  )
}