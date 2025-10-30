import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function Assistant() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [contextSummary, setContextSummary] = useState<{ answersCount: number, benefitsCount: number } | null>(null)
  const scrollRef = useRef<ScrollView>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const token = await (await import('@react-native-async-storage/async-storage')).default.getItem('token')
        const [ctxRes, histRes] = await Promise.all([
          fetch('http://localhost:5000/assistant/context', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:5000/assistant/history', { headers: { 'Authorization': `Bearer ${token}` } }),
        ])
        const ctx = await ctxRes.json()
        if (ctx?.status === 'success') {
          const ans = ctx.data?.answers || {}
          const bens = ctx.data?.benefits || []
          setContextSummary({ answersCount: Object.keys(ans).length, benefitsCount: bens.length })
        }
        const histJson = await histRes.json()
        if (histJson?.status === 'success') {
          setMessages(histJson.data.map((m: any) => ({ role: m.role, content: m.content })))
        }
      } catch {}
    })()
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true })
  }, [messages])

  const send = async () => {
    const content = input.trim()
    if (!content || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content }])
    setLoading(true)
    try {
      const token = await (await import('@react-native-async-storage/async-storage')).default.getItem('token')
      const res = await fetch('http://localhost:5000/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ message: content })
      })
      const json = await res.json()
      if (json?.status === 'success') {
        setMessages(prev => [...prev, { role: 'assistant', content: json.message }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I had trouble answering that.' }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1 bg-col4">
      {contextSummary && (
        <View className="px-5 pt-16 pb-2">
          <Text className="text-col2">Context loaded: {contextSummary.answersCount} answers, {contextSummary.benefitsCount} benefits</Text>
        </View>
      )}
      <ScrollView ref={scrollRef} className="flex-1 px-5">
        {messages.map((m, i) => (
          <View key={i} className={`mb-3 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <View className={`max-w-[80%] rounded-2xl px-4 py-3 ${m.role === 'user' ? 'bg-[#4E4FEB]' : 'bg-dg'}`}>
              <Text className={m.role === 'user' ? 'text-white' : 'text-col1'}>{m.content}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View className="flex-row items-center p-4 bg-col4 border-t border-gray-700">
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask about your benefits or how to use the app"
          placeholderTextColor="#9CA3AF"
          className="flex-1 bg-dg text-white rounded-xl px-4 py-3 mr-3"
        />
        <TouchableOpacity onPress={send} activeOpacity={0.8} className={`px-4 py-3 rounded-xl ${loading ? 'bg-gray-500' : 'bg-[#4E4FEB]'}`} disabled={loading}>
          <Text className="text-white font-semibold">Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
