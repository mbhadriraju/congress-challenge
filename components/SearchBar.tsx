import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { TextInput, View } from 'react-native'

interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
  onFocusChange: (focused: boolean) => void
}

const SearchBar = ({ value, onChangeText, onFocusChange }: SearchBarProps) => {
  return (
    <View className="flex-row items-center bg-dg rounded-full px-4 py-2">
      <Ionicons name="search" size={20} color="#D3D3D3" className="mr-2" />
      <TextInput
        className="flex-1 color-lg text-base leading-5"
        style={{ textAlignVertical: 'center' }}
        placeholder="Search for benefits"
        placeholderTextColor="#5E5E5E"
        value={value}
        onChangeText={onChangeText}
        onFocus={() => onFocusChange(true)}
        onBlur={() => onFocusChange(false)}
      />
    </View>
  )
}

export default SearchBar