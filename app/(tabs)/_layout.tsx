import { Feather } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'
import { View } from 'react-native'

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#0A0A0A',
          borderTopWidth: 1,
          borderTopColor: '#1A1A1A',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#4E4FEB',
        tabBarInactiveTintColor: '#808080',
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