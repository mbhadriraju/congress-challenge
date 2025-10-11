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
    
    const backendUrl = 'http://localhost:5000/login'
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
      className="flex-1 bg-col4 px-6" 
      contentContainerStyle={{ flexGrow: 1 }}>
      <View className="pt-16 items-center">
        <Text className="text-3xl text-col1 font-bold mb-8 text-center">Login</Text>
      </View>
      <View className="flex-1 justify-center items-center px-10 mb-52">
        <TextInput
          className="w-full px-5 py-3 h-16 text-white font-semibold bg-col5 border rounded-2xl bg-dg"
          placeholder="Email"
          keyboardType="email-address"
          placeholderTextColor="#ccc"
          onChangeText={changeEmail}/>
        <TextInput
          className="w-full px-5 py-3 h-16 text-white font-semibold bg-col5 border rounded-2xl bg-dg mt-4"
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry={true}
          onChangeText={changePassword}/>
        {error !== '' && ( <Text className="text-red-500 mt-4 font-semibold">{error}</Text> )}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={exportData}
          className="w-full mt-4 py-4 items-center rounded-2xl bg-col3">
          <Text className="text-col1 font-bold text-xl">Login</Text>
        </TouchableOpacity>
        <Text className="text-col2 underline mt-4" onPress={() => goToSignup ? goToSignup() : router.replace('/signup')}>Don't have an account?</Text>
      </View>

    </ScrollView>
  )
}