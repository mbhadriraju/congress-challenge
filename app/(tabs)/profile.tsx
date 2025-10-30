import { Feather } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Link, router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useAuth } from '../context/AuthProvider'


function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const user = useAuth()
  const [email, setEmail] = useState(user.userInfo.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [error, setError] = useState('')

  // Keep local email in sync with context when not editing
  useEffect(() => {
    if (!isEditing && user.userInfo?.email && user.userInfo.email !== email) {
      setEmail(user.userInfo.email)
    }
  }, [user.userInfo?.email, isEditing])

  async function deleteAccount() {
    const token = await AsyncStorage.getItem('token')
    const backendUrl = 'http://kando.govt.hu:5000/profile/delete'
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
    if (!isEditing) {
      setIsEditing(true)
      setError('')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Invalid email format")
      return
    }
    if (!currentPassword) {
      setError("Current password is required")
      return
    }

    try {
      const tokenFromStorage = await AsyncStorage.getItem('token')
      const token = user.token || tokenFromStorage || ''
      const backendUrl = 'http://kando.govt.hu:5000/profile/change-email'

      const sendData = {
        newEmail: email?.toLowerCase(),
        password: currentPassword
      }

      const sendResponse = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(sendData)
      })

      const getData = await sendResponse.json()
      if (!sendResponse.ok || getData.status === 'error') {
        setError(getData.message || 'Failed to update email')
        return
      }

      // Update context and local state explicitly from server response
      const updatedEmail = getData?.user?.email || email?.toLowerCase()
      user.setUserInfo({
        email: updatedEmail,
        firstName: user.userInfo.firstName,
        lastName: user.userInfo.lastName
      })
      setEmail(updatedEmail)
      setCurrentPassword('')
      setIsEditing(false)
      setError('')
    } catch (e) {
      setError('Network error. Please try again.')
    }
  }

  return (
    <ScrollView className="flex-1 bg-bg px-6 pt-16">
      <Text className="text-3xl text-text font-bold mb-8 text-center">Profile</Text>
      
      <View className="space-y-6">
        <View className="bg-surface rounded-2xl p-5 border border-surfaceElevated">
          <Text className="text-text font-semibold text-lg mb-3">Email</Text>
          <View className="flex-row items-center justify-between">
            <TextInput
              value={email}
              onChangeText={setEmail}
              editable={isEditing}
              className={`text-text text-lg flex-1 ${
                isEditing ? 'bg-bgSecondary px-3 py-2 rounded-xl' : ''
              }`}
            />
            <TouchableOpacity onPress={() => changeEmail()} activeOpacity={0.6} className="ml-3">
              <Feather 
                name={isEditing ? "check" : "edit-2"} 
                size={22} 
                color={isEditing ? "#10B981" : "#4E4FEB"} 
              />
            </TouchableOpacity>
          </View>
          {isEditing && (
            <TextInput
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              placeholder="Current password"
              placeholderTextColor="#808080"
              className="text-text text-base mt-3 bg-bgSecondary px-3 py-3 rounded-xl"
            />
          )}
          {error !== '' && ( <Text className="text-error mt-3 font-semibold text-sm">{error}</Text> )}
        </View>

        <View className="mt-8">
          <TouchableOpacity
            className="mx-3 mb-4 bg-surface rounded-2xl p-4 border border-surfaceElevated"
            activeOpacity={0.6}
          >
            <Link className="text-text text-center text-lg font-semibold" href="/change-password">
              Change Password
            </Link>
          </TouchableOpacity>
          
          <View className="flex-row justify-between gap-3">
            <TouchableOpacity
              onPress={logOut}
              className="flex-1 bg-primary rounded-2xl p-4"
              activeOpacity={0.8}
            >
              <Text className="text-white text-center text-lg font-semibold">Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={deleteAccount}
              className="flex-1 bg-error rounded-2xl p-4"
              activeOpacity={0.8}
            >
              <Text className="text-white text-center text-lg font-semibold">
                Delete Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default Profile