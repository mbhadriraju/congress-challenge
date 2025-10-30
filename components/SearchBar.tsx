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
    <View className="flex-row items-center bg-surface rounded-full px-4 py-3 border border-surfaceElevated">
      <Ionicons name="search" size={20} color="#B0B0B0" className="mr-3" />
      <TextInput
        className="flex-1 text-text text-base"
        style={{ textAlignVertical: 'center' }}
        placeholder="Search for benefits..."
        placeholderTextColor="#808080"
        value={value}
        onChangeText={onChangeText}
        onFocus={() => onFocusChange(true)}
        onBlur={() => onFocusChange(false)}
      />
    </View>
  )
}

export default SearchBar