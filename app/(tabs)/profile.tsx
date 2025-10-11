import { Feather } from '@expo/vector-icons'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useAuth } from '../context/AuthProvider'
import AsyncStorage from '@react-native-async-storage/async-storage';


function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const user = useAuth()
  const [email, setEmail] = useState(user.userInfo.email || '')
  const [error, setError] = useState('')

  async function deleteAccount() {
    const token = await AsyncStorage.getItem('token')
    const backendUrl = 'http://localhost:5000/profile/delete'
    const sendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })

    if (!sendResponse.ok) {
      console.log('Failed to send data:', sendResponse.statusText)
    }
    const getData = await sendResponse.json()
    console.log(getData)
    if (getData.status === 'success') {
      await user.logout()
      router.replace('../onboarding')
    }
  }

  async function logOut() {
    await user.logout()
    router.replace('/login')
  }

  async function changeEmail() {
    const token = await AsyncStorage.getItem('token')
    setIsEditing(!isEditing)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Invalid email format")
      return
    }
    const backendUrl = 'http://localhost:5000/profile/change-email'



    const sendData = {
      oldEmail: user.userInfo.email,
      newEmail: email?.toLowerCase()
    }
    if (sendData.newEmail !== sendData.oldEmail) {
      console.log('diff')

      const sendResponse = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(sendData)
      })

      if (!sendResponse.ok) {
        console.log('Failed to send data:', sendResponse.statusText)
      }
      const getData = await sendResponse.json()
      console.log(getData)
      if (getData.status === 'error') {
        setError(getData.message)
      }
      else if (getData.status === 'success') {
        user.setUserInfo({
          email: email?.toLowerCase(),
          firstName: user.userInfo.firstName,
          lastName: user.userInfo.lastName
        })
        setError('')
      }
    }
  }

  return (
    <ScrollView className="flex-1 bg-col4 px-6 pt-16">
      <Text className="text-3xl text-col1 font-bold mb-8 text-center">Profile</Text>
      
      <View className="space-y-6">
        <View>
          <Text className="text-col1 font-semibold text-xl">Email</Text>
          <View className="flex-row items-center justify-between">
            <TextInput
              value={email}
              onChangeText={setEmail}
              editable={isEditing}
              className={`text-blue-200 text-xl flex-1 ml-4 ${
                isEditing ? 'bg-dg p-2 rounded-lg' : ''
              }`}
            />
            <TouchableOpacity onPress={() => changeEmail()} activeOpacity={0.6}>
              <Feather 
                name={isEditing ? "check" : "edit-2"} 
                size={24} 
                color="#4E4FEB" 
              />
            </TouchableOpacity>
          </View>
          {error !== '' && ( <Text className="text-red-500 mt-4 font-semibold">{error}</Text> )}
        </View>

        <View className="mt-16">
          <View className="flex-row justify-between space-x-4">
            <TouchableOpacity
              onPress={logOut}
              className="flex-1 mx-3 bg-[#4E4FEB] rounded-2xl p-4"
              activeOpacity={0.6}
            >
              <Text className="text-white text-center text-lg font-semibold">Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={deleteAccount}
              className="flex-1 mx-3 bg-[#DC2626] rounded-2xl p-4"
              activeOpacity={0.6}
            >
              <Text className="text-white text-center text-lg font-semibold">
                Delete Account
              </Text>
            </TouchableOpacity>
          </View>
            <TouchableOpacity
              className="flex-1 mx-3 mt-6 bg-dg rounded-2xl p-4"
              activeOpacity={0.6}
            >
              <Link className="text-white text-center text-lg font-semibold" href="/change-password">
                Change Password
              </Link>
            </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

export default Profile