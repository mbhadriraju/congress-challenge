import { router } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useAuth } from './context/AuthProvider'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChangePassword({ goToSignup }: any) {
  const [oldPassword, changeOldPassword] = useState('')
  const [newPassword, changeNewPassword] = useState('')
  const [error, setError] = useState('')
  const user = useAuth()
  console.log(user)
  async function exportData() {
    const send_data = {
      "oldPassword": oldPassword,
      "newPassword": newPassword,
      "email": user.userInfo.email
    }
    console.log(send_data)
    const url = 'http://localhost:5000/index/api'
    const backendUrl = 'http://localhost:5000/change-password'
    const token = await AsyncStorage.getItem('token')
    const sendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(send_data)
    })
    
    if (!sendResponse.ok) {
      console.log('Failed to send data:', sendResponse.statusText)
    }
    
    const getData = await sendResponse.json()
    console.log(getData)
    console.log(getData)
    if (getData.status === 'error') {
      setError(getData.message)
      console.log(getData.message)
    }
    else if (getData.status === 'success') {
      if (newPassword.length < 8) {
        setError("New password must be at least 8 characters")
        return
      }
      setError('')
      console.log("success")
      router.replace('/profile')
    }
  }
  return (
    <ScrollView 
      className="flex-1 bg-col4 px-6" 
      contentContainerStyle={{ flexGrow: 1 }}>
      <View className="pt-16 items-center">
        <Text className="text-3xl text-col1 font-bold mb-8 text-center">Change Password</Text>
      </View>
      <View className="flex-1 justify-center items-center px-10 mb-52">
        <TextInput
          className="w-full px-5 py-3 h-16 text-white font-semibold bg-col5 border rounded-2xl bg-dg mt-4"
          placeholder="Old Password"
          placeholderTextColor="#ccc"
          secureTextEntry={true}
          onChangeText={changeOldPassword}/>
        <TextInput
          className="w-full px-5 py-3 h-16 text-white font-semibold bg-col5 border rounded-2xl bg-dg mt-4"
          placeholder="New Password"
          placeholderTextColor="#ccc"
          secureTextEntry={true}
          onChangeText={changeNewPassword}/>
        {error !== '' && ( <Text className="text-red-500 mt-4 font-semibold">{error}</Text> )}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={exportData}
          className="w-full mt-4 py-4 items-center rounded-2xl bg-col3">
          <Text className="text-col1 font-bold text-xl">Change Password</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  )
}