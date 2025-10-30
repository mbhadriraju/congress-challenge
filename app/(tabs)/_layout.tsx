import { Feather } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'
import { View } from 'react-native'

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: '#4E4FEB',
        tabBarInactiveTintColor: '#888888',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <View>
              <Feather name="home" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="quest"
        options={{
          title: 'Survey',
          tabBarIcon: ({ color }) => (
            <View>
              <Feather name="file-text" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          title: 'Assistant',
          tabBarIcon: ({ color }) => (
            <View>
              <Feather name="message-circle" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <View>
              <Feather name="user" color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  )
}

export default _layout