import { View, Text, Pressable, Animated, ScrollView, TextInput } from 'react-native';
import React, { useState, useRef } from 'react';
import { Feather } from '@expo/vector-icons';

function profile() {
  const [email, setEmail] = useState('sample123@gmail.com');
  const [password, setPassword] = useState('********');
  const [isEditing, setIsEditing] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const changePasswordAnim = useRef(new Animated.Value(0)).current;
  const deleteAccountAnim = useRef(new Animated.Value(0)).current;

  const animateChangePassword = (toValue: number) => {
    Animated.timing(changePasswordAnim, {
      toValue,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const animateDeleteAccount = (toValue: number) => {
    Animated.timing(deleteAccountAnim, {
      toValue,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const changePasswordBg = changePasswordAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#181C14', '#111410']
  });

  const deleteAccountBg = deleteAccountAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#DC2626', '#B91C1C']
  });

  const animateButton = (toValue: number) => {
    Animated.timing(animatedValue, {
      toValue,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#4E4FEB', '#3a3bb8']
  });

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
              className={`text-blue-200 text-xl flex-1 ml-4${
                isEditing ? 'bg-dg p-2 rounded-lg' : ''
              }`}
            />
            <Pressable onPress={() => setIsEditing(!isEditing)}>
              <Feather 
                name={isEditing ? "check" : "edit-2"} 
                size={24} 
                color="#4E4FEB" 
              />
            </Pressable>
          </View>
        </View>

        <View>
        <Text className="text-col1 font-semibold text-xl my-3">Password</Text>
        <Pressable 
          onPress={() => console.log('Change password')}
          onPressIn={() => animateChangePassword(1)}
          onPressOut={() => animateChangePassword(0)}
        >
          <Animated.View 
            style={{ backgroundColor: changePasswordBg }}
            className="rounded-lg p-2 mx-6"
          >
            <Text className="text-white text-center text-lg font-semibold">
              Change Password
            </Text>
          </Animated.View>
        </Pressable>
      </View>


        <View className="mt-16">
          <View className="flex-row justify-between space-x-4">
            <Pressable
              onPress={() => console.log('Logout')}
              onPressIn={() => animateButton(1)}
              onPressOut={() => animateButton(0)}
              className="flex-1 mx-3"
            >
              <Animated.View 
                style={{ backgroundColor }}
                className="rounded-lg p-4"
              >
                <Text className="text-white text-center text-lg font-semibold">
                  Log Out
                </Text>
              </Animated.View>
            </Pressable>

            <Pressable
              onPress={() => console.log('Delete account')}
              onPressIn={() => animateDeleteAccount(1)}
              onPressOut={() => animateDeleteAccount(0)}
              className="flex-1 mx-3"
            >
              <Animated.View 
                style={{ backgroundColor: deleteAccountBg }}
                className="rounded-lg p-4"
              >
                <Text className="text-white text-center text-lg font-semibold">
                  Delete Account
                </Text>
              </Animated.View>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default profile;