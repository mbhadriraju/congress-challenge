import React, { useEffect, useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

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
          fetch('http://kando.govt.hu:5000/assistant/context', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://kando.govt.hu:5000/assistant/history', { headers: { 'Authorization': `Bearer ${token}` } }),
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
    if (messages.length > 0) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }, [messages, loading])

  const send = async () => {
    const content = input.trim()
    if (!content || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content }])
    setLoading(true)
    try {
      const token = await (await import('@react-native-async-storage/async-storage')).default.getItem('token')
      const res = await fetch('http://kando.govt.hu:5000/assistant/chat', {
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
    <KeyboardAvoidingView 
      className="flex-1 bg-bg"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View className="flex-1">
        {contextSummary && (
          <View className="px-5 pt-16 pb-3">
            <View className="bg-surface/50 rounded-xl px-4 py-2 border border-surfaceElevated">
              <Text className="text-textSecondary text-sm">Context: {contextSummary.answersCount} answers, {contextSummary.benefitsCount} benefits loaded</Text>
            </View>
          </View>
        )}
        <ScrollView 
          ref={scrollRef} 
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => {
            setTimeout(() => {
              scrollRef.current?.scrollToEnd({ animated: true })
            }, 100)
          }}
        >
          {messages.length === 0 && (
            <View className="mt-8 items-center">
              <Text className="text-text text-xl font-bold mb-2">Benefits Assistant</Text>
              <Text className="text-textSecondary text-center leading-6">
                Ask me about your benefits, how to apply, or help navigating the app.
              </Text>
            </View>
          )}
          {messages.map((m, i) => (
            <View key={i} className={`mb-4 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <View className={`max-w-[85%] rounded-2xl px-4 py-3 border ${
                m.role === 'user' 
                  ? 'bg-primary border-primary' 
                  : 'bg-surface border-surfaceElevated'
              }`}>
                <Text className={m.role === 'user' ? 'text-white' : 'text-text'}>{m.content}</Text>
              </View>
            </View>
          ))}
          {loading && (
            <View className="items-start mb-4">
              <View className="bg-surface border border-surfaceElevated rounded-2xl px-4 py-3">
                <Text className="text-textSecondary">Thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>
        <View className="flex-row items-center p-4 bg-bg border-t border-surfaceElevated">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask about your benefits or how to use the app..."
            placeholderTextColor="#808080"
            className="flex-1 bg-surface text-text rounded-2xl px-4 py-3 mr-3 border border-surfaceElevated"
            multiline
            style={{ maxHeight: 100 }}
            onSubmitEditing={send}
            returnKeyType="send"
          />
          <TouchableOpacity 
            onPress={send} 
            activeOpacity={0.8} 
            className={`px-5 py-3 rounded-2xl ${loading ? 'bg-textTertiary' : 'bg-primary'}`} 
            disabled={loading}
          >
            <Text className="text-white font-semibold">Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
