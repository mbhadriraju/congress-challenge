import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList
} from "react-native"
import { Link, Redirect } from "expo-router"
import { useState, useEffect, useContext } from "react"
import SearchBar from "@/components/SearchBar"
import { Feather } from "@expo/vector-icons"
import { useAuth }  from "../context/AuthProvider"
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Index() {
  const userInfo = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [data, setData] = useState(null)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [redirect, setRedirect] = useState(false)

  console.log(userInfo)

  
  const fetchData = async () => {
    const token = await AsyncStorage.getItem('token')
    const url = 'http://localhost:5000/index/api'
    const sendResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    if (!sendResponse.ok) {
      console.log('Failed to send data:', sendResponse.statusText)
    }

    const getData = await sendResponse.json()
    console.log(getData)
    if (getData.status === 'error') {
      console.error(getData.message)
      if (sendResponse.status === 403) {
        setRedirect(true)
      }
    }
    else if (getData.status === 'success') {
      setData(getData.data)
    }
  }

  useEffect(() => {
    if (!data) fetchData()
  }, [])
  

  const filteredData = data
  //@ts-ignore
    ? data.filter((item) => {
        const searchTerm = searchQuery.toLowerCase()
        const idString = item.id.toString().toLowerCase()
        return idString.includes(searchTerm)
      })
    : []

  type dataProps = {
    id: string
    userId: string
  }

  const Data = ({ id, userId }: dataProps) => {
    return (
      <Link href={`./spec/${id}`} asChild>
        <TouchableOpacity
          activeOpacity={0.8}
          className="rounded-lg p-4 mb-4 flex-row items-center bg-[#181C14]"
        >
          <View className="flex-1 mr-4">
            <Text className="text-col1 text-lg font-bold">{id}</Text>
            <Text className="text-col2 text-base flex-shrink">{userId}</Text>
          </View>
          <Feather name="chevron-right" size={24} color="white" />
        </TouchableOpacity>
      </Link>
    )
  }
  if (redirect) {
    return <Redirect href="/onboarding" />
  }
  return (
    <FlatList
      className="flex-1 bg-col4 px-5 pt-16"
      data={filteredData}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <Data id={item.id} userId={item.userId} />}
      ListHeaderComponent={
        <>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocusChange={setIsSearchFocused}
          />
          {!isSearchFocused && (
            <View className="mt-4">
              <Text className="text-col2 py-10 text-5xl font-bold text-center">
                Welcome{" " + userInfo.userInfo.firstName}!
              </Text>
              <Text className="text-col1 text-xl font-bold text-center px-8">
                This application allows users to identify the benefits they
                qualify for by answering a quick series of questions
              </Text>
              <Link href="/quest" asChild>
                <TouchableOpacity
                  className="mt-10 items-center bg-[#4E4FEB] rounded-lg mx-20"
                  activeOpacity={0.8}
                >
                  <Text className="text-white text-2xl font-bold px-6 py-3">
                    Start Questionnaire
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}
          <Text className="text-col1 mt-10 mb-6 text-5xl font-bold">
            Benefits
          </Text>
        </>
      }
      ListEmptyComponent={
        <Text className="text-col1 text-center mt-4">
          No benefits found matching your search
        </Text>
      }
    />
  )
}