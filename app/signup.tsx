import { router } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useAuth } from './context/AuthProvider'

export default function Signup({ goToLogin }: any) {
  const [firstName, changeFirstName] = useState('')
  const [lastName, changeLastName] = useState('')
  const [email, changeEmail] = useState('')
  const [password, changePassword] = useState('')
  const [error, setError] = useState('')
  const user = useAuth()
  async function exportData() {
    const send_data = {
      "email": email.toLowerCase(),
      "password": password,
      "firstName": firstName,
      "lastName": lastName
    }

    const backendUrl = 'http://localhost:5000/signup'
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
      console.error('Signup error:', error)
      setError('Network error. Please try again.')
    }
  }

  function checkCreds(firstName: string, lastName: string, email: string, password: string) {
    if (!firstName || !lastName || !email || !password) {
      setError("Missing required fields")
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Invalid email format")
      return
    }
    if (password.length < 8) {
      setError("Password length must be at least 8 characters")
      return
    }
    setError('') 
    exportData()
  }

  return (
    <ScrollView 
      className="flex-1 bg-col4 px-6" 
      contentContainerStyle={{ flexGrow: 1 }}>
      <View className="pt-16 items-center">
        <Text className="text-3xl text-col1 font-bold mb-8 text-center">Signup</Text>
      </View>
      <View className="flex-1 justify-center items-center px-10 mb-52">
        <TextInput
          className="w-full px-5 mb-3 h-16 text-white font-semibold bg-col5 border rounded-2xl bg-dg"
          placeholder="First Name"
          placeholderTextColor="#ccc"
          onChangeText={changeFirstName}/>
        <TextInput
          className="w-full px-5 py-3 h-16 text-white font-semibold bg-col5 border rounded-2xl bg-dg"
          placeholder="Last Name"
          placeholderTextColor="#ccc"
          onChangeText={changeLastName}/>
        <TextInput
          className="w-full px-5 mt-3 h-16 text-white font-semibold bg-col5 border rounded-2xl bg-dg"
          placeholder="Email"
          keyboardType="email-address"
          placeholderTextColor="#ccc"
          onChangeText={changeEmail}/>
        <TextInput
          className="w-full px-5 h-16 mt-3 text-white font-semibold bg-col5 border rounded-2xl bg-dg"
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry={true}
          onChangeText={changePassword}/>
        {error !== '' && ( <Text className="text-red-500 mt-4 font-semibold">{error}</Text> )}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => checkCreds(firstName, lastName, email, password)}
          className="w-full mt-4 py-4 items-center rounded-2xl bg-col3">
          <Text className="text-col1 font-bold text-xl">Create Account</Text>
        </TouchableOpacity>
        <Text className="text-col2 underline mt-4" onPress={() => goToLogin ? goToLogin() : router.replace('/login')}>Already have an account?</Text>
      </View>
    </ScrollView>
  )
}