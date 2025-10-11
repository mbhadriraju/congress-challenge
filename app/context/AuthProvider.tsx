import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'

type UserInfoType = {
  email: string | null
  firstName: string | null
  lastName: string | null
  benefits?: any[]
}

type AuthContextType = {
  loggedIn: boolean
  userInfo: UserInfoType
  token: string | null
  setLoggedIn: (status: boolean) => void
  setUserInfo: (info: UserInfoType) => void
  setToken: (token: string | null) => void
  login: (token: string, userInfo: UserInfoType) => Promise<void>
  logout: () => Promise<void>
}

const defaultContext: AuthContextType = {
  loggedIn: false,
  userInfo: {
    email: null,
    firstName: null,
    lastName: null,
  },
  token: null,
  setLoggedIn: () => {
    throw new Error('setLoggedIn called outside AuthProvider')
  },
  setUserInfo: () => {
    throw new Error('setUserInfo called outside AuthProvider')
  },
  setToken: () => {
    throw new Error('setToken called outside AuthProvider')
  },
  login: async () => {
    throw new Error('login called outside AuthProvider')
  },
  logout: async () => {
    throw new Error('logout called outside AuthProvider')
  },
}

export const UserContext = createContext<AuthContextType>(defaultContext)

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfoType>({
    email: null,
    firstName: null,
    lastName: null,
  })
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    loadStoredAuth()
  }, [])

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token')
      const storedUserInfo = await AsyncStorage.getItem('userInfo')
      
      if (storedToken && storedUserInfo) {
        setToken(storedToken)
        setUserInfo(JSON.parse(storedUserInfo))
        setLoggedIn(true)
      }
    } catch (error) {
      console.error('Error loading stored auth:', error)
    }
  }

  const login = async (newToken: string, newUserInfo: UserInfoType) => {
    try {
      await AsyncStorage.setItem('token', newToken)
      await AsyncStorage.setItem('userInfo', JSON.stringify(newUserInfo))
      setToken(newToken)
      setUserInfo(newUserInfo)
      setLoggedIn(true)
    } catch (error) {
      console.error('Error saving auth data:', error)
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token')
      await AsyncStorage.removeItem('userInfo')
      setToken(null)
      setUserInfo({
        email: null,
        firstName: null,
        lastName: null,
      })
      setLoggedIn(false)
    } catch (error) {
      console.error('Error clearing auth data:', error)
    }
  }

  const value: AuthContextType = {
    loggedIn,
    userInfo,
    token,
    setLoggedIn,
    setUserInfo,
    setToken,
    login,
    logout,
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useAuth() {
  return useContext(UserContext)
}
