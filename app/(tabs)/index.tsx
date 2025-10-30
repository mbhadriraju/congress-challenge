import SearchBar from "@/components/SearchBar"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Link, Redirect } from "expo-router"
import { useEffect, useState } from "react"
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Linking
} from "react-native"
import { useAuth } from "../context/AuthProvider"
import questions from '../../res/questions.json'


type Benefit = {
  id: string
  name: string
  reason?: string
  qualify?: boolean
  description?: string
}

function getFirstUrl(text?: string): string | null {
  if (!text) return null
  const match = text.match(/https?:\/\/[^\s)]+/i)
  return match ? match[0] : null
}

export default function Index() {
  const userInfo = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [data, setData] = useState<Benefit[] | null>(null)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [redirect, setRedirect] = useState(false)
  const [numCompletedSections, setNumCompletedSections] = useState<number>(0)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null)
  const TOTAL_SECTIONS = 10
  
  console.log(userInfo)

  
  const fetchData = async (all: boolean) => {
    const token = await AsyncStorage.getItem('token')
    const url = `http://localhost:5000/index/api${all ? '?all=true' : ''}`
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

  const computeCompletedSections = (answers: Record<string, string>) => {
    const sections: Record<number, { total: number; answered: number }> = {}
    const SECTIONS = TOTAL_SECTIONS
    const chunkSize = Math.ceil(questions.length / SECTIONS)
    const withSection = (questions as any).map((q: any, idx: number) => {
      if (q.section && q.section >= 1 && q.section <= SECTIONS) return q
      const derived = Math.min(Math.floor(idx / chunkSize) + 1, SECTIONS)
      return { ...q, section: derived }
    })
    for (let s = 1; s <= SECTIONS; s++) {
      const qs = withSection.filter((q: any) => q.section === s)
      const total = qs.length
      const answered = qs.filter((q: any) => typeof answers[q.id] === 'string' && answers[q.id].trim() !== '').length
      sections[s] = { total, answered }
    }
    let completed = 0
    for (let s = 1; s <= SECTIONS; s++) {
      if (sections[s].total > 0 && sections[s].answered === sections[s].total) completed++
    }
    return completed
  }

  const checkQuestAnswers = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      if (!token) { setNumCompletedSections(0); return }
      const resp = await fetch('http://localhost:5000/quest', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      if (resp.status === 404) { setNumCompletedSections(0); return }
      if (!resp.ok) { setNumCompletedSections(0); return }
      const json = await resp.json()
      if (json?.status === 'success' && json?.answers) {
        const completed = computeCompletedSections(json.answers)
        setNumCompletedSections(completed)
      } else {
        setNumCompletedSections(0)
      }
    } catch {
      setNumCompletedSections(0)
    }
  }

  useEffect(() => {
    if (!data) fetchData(false)
    checkQuestAnswers()
  }, [])

  useEffect(() => {
    // when focusing search, load all benefits
    fetchData(isSearchFocused)
  }, [isSearchFocused])

  const handleSearchFocusChange = (focused: boolean) => {
    if (focused) setIsSearchFocused(true)
  }

  const exitSearch = () => {
    setIsSearchFocused(false)
    fetchData(false)
  }
  

  const filteredData = data
    ? data.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  const onSelectBenefit = (item: Benefit) => {
    setSelectedBenefit(item)
    setModalVisible(true)
  }

  const Data = ({ item }: { item: Benefit }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        className="rounded-lg p-4 mb-4 flex-row items-center bg-[#181C14]"
        onPress={() => onSelectBenefit(item)}
      >
        <View className="flex-1 mr-4">
          <Text className="text-col1 text-lg font-bold">{item.name}</Text>
          {!!item.reason && !isSearchFocused && (
            <Text className="text-col2 text-base flex-shrink">{item.reason}</Text>
          )}
        </View>
        {isSearchFocused && (
          <Text className={`text-sm font-semibold ${item.qualify ? 'text-green-400' : 'text-red-400'}`}>
            {item.qualify ? 'Qualify' : 'Do not qualify'}
          </Text>
        )}
      </TouchableOpacity>
    )
  }
  if (redirect) {
    return <Redirect href="/onboarding" />
  }
  const url = getFirstUrl(selectedBenefit?.description)
  return (
    <>
      <FlatList
        className="flex-1 bg-col4 px-5 pt-16"
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Data item={item} />}
        keyboardShouldPersistTaps="always"
        ListHeaderComponent={
          <>
            <View className="flex-row items-center">
              <View className="flex-1">
                <SearchBar
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onFocusChange={handleSearchFocusChange}
                />
              </View>
              {isSearchFocused && (
                <TouchableOpacity
                  onPress={exitSearch}
                  activeOpacity={0.7}
                  className="ml-3 px-3 py-2 rounded-lg bg-dg"
                >
                  <Text className="text-col1 font-semibold">Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
            {!isSearchFocused && (
              <View className="mt-4">
                <Text className="text-col2 py-10 text-5xl font-bold text-center">
                  Welcome{" " + userInfo.userInfo.firstName}!
                </Text>
                <Text className="text-col1 text-xl font-bold text-center px-8">
                  This application allows users to identify the benefits they
                  qualify for by answering a quick series of questions
                </Text>
                {numCompletedSections === 0 && (
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
                )}
                {numCompletedSections > 0 && numCompletedSections < TOTAL_SECTIONS && (
                  <Link href="/quest" asChild>
                    <TouchableOpacity
                      className="mt-4 items-center bg-[#4E4FEB] rounded-lg mx-20"
                      activeOpacity={0.8}
                    >
                      <Text className="text-white text-2xl font-bold px-6 py-3">
                        Continue Questionnaire ({TOTAL_SECTIONS - numCompletedSections} sections remaining)
                      </Text>
                    </TouchableOpacity>
                  </Link>
                )}
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

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
          className="flex-1 bg-black/50 justify-end"
        >
          <TouchableOpacity
            activeOpacity={1}
            className="bg-[#181C14] rounded-t-2xl p-6"
            onPress={() => {}}
          >
            <Text className="text-col1 text-2xl font-bold mb-2">{selectedBenefit?.name}</Text>
            {selectedBenefit?.qualify !== undefined && (
              <Text className={`mb-3 font-semibold ${selectedBenefit?.qualify ? 'text-green-400' : 'text-red-400'}`}>
                {selectedBenefit?.qualify ? 'You likely qualify' : 'You likely do not qualify'}
              </Text>
            )}
            {!!selectedBenefit?.reason && (
              <Text className="text-col2 mb-3">Reason: {selectedBenefit?.reason}</Text>
            )}
            <Text className="text-col1">
              {selectedBenefit?.description || 'No description available.'}
            </Text>
            <View className="flex-row mt-6 justify-end">
              {url && (
                <TouchableOpacity
                  onPress={async () => { try { await Linking.openURL(url) } catch {} }}
                  activeOpacity={0.8}
                  className="mr-3 px-4 py-2 rounded-lg bg-dg"
                >
                  <Text className="text-col1 font-semibold">Open Link</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                activeOpacity={0.8}
                className="px-4 py-2 rounded-lg bg-[#4E4FEB]"
              >
                <Text className="text-white font-semibold">Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  )
}