import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { View } from 'react-native';
import { Feather } from '@expo/vector-icons';

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
            tabBarIcon: ({ focused, color, size }) => {
                return (
                    <View>
                        <Feather name="home" color={color}/>
                    </View>
                )
            },
         }}
      />
      <Tabs.Screen
        name="quest"
        options={{ 
            title: 'Survey',
            tabBarIcon: ({ focused, color, size }) => {
                return (
                    <View>
                        <Feather name="file-text" color={color}/>
                    </View>
                )
            },
         }}
      />
      <Tabs.Screen
        name="profile"
        options={{ 
            title: 'Profile',
            tabBarIcon: ({ focused, color, size }) => {
                return (
                    <View>
                        <Feather name="user" color={color}/>
                    </View>
                )
            },
         }}
      />
    </Tabs>
  );
};

export default _layout;