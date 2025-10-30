import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from './context/AuthProvider';

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
    const url = 'http://kando.govt.hu:5000/index/api'
    const backendUrl = 'http://kando.govt.hu:5000/change-password'
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
      className="flex-1 bg-bg px-6" 
      contentContainerStyle={{ flexGrow: 1 }}>
      <View className="pt-20 items-center mb-12">
        <Text className="text-4xl text-text font-bold mb-3 text-center">Change Password</Text>
        <Text className="text-textSecondary text-lg text-center">Update your account security</Text>
      </View>
      <View className="flex-1 justify-center items-center px-8 mb-52">
        <TextInput
          className="w-full px-5 h-14 text-text font-medium bg-surface border border-surfaceElevated rounded-2xl mb-4"
          placeholder="Old Password"
          placeholderTextColor="#808080"
          secureTextEntry={true}
          onChangeText={changeOldPassword}/>
        <TextInput
          className="w-full px-5 h-14 text-text font-medium bg-surface border border-surfaceElevated rounded-2xl"
          placeholder="New Password"
          placeholderTextColor="#808080"
          secureTextEntry={true}
          onChangeText={changeNewPassword}/>
        {error !== '' && ( 
          <View className="w-full mt-4 bg-error/20 border border-error rounded-xl p-3">
            <Text className="text-error font-semibold text-sm">{error}</Text>
          </View>
        )}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={exportData}
          className="w-full mt-6 py-4 items-center rounded-2xl bg-primary shadow-lg">
          <Text className="text-white font-bold text-lg">Change Password</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  )
}