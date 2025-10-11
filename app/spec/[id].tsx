import { fetchData } from "@/res/api"
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'

interface BenefitProps {
  id: string
  title: string
  completed: boolean
  userId: number
}

const Benefit = (props: BenefitProps) => {
  const { id } = useLocalSearchParams()
  const [data, setData] = useState<BenefitProps | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchData(id as string)
        setData(result)
      } catch (err) {
        console.error('Error: ', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-col4">
        <ActivityIndicator size="large" color="#4E4FEB" />
      </View>
    )
  }

  if (!data) {
    return (
      <View className="flex-1 justify-center items-center bg-col4">
        <Text className="text-col1 text-lg">Failed to load benefit</Text>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-col4 px-6 pt-16">
      <Text className="text-col1 mb-6 mt-20 text-5xl font-bold">{data.id}</Text>
      <Text className="text-col1 text-2xl font-semibold mb-4">{data.title}</Text>
    </ScrollView>
  )
}

export default Benefit