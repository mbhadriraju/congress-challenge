import { Feather } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Picker } from '@react-native-picker/picker'
import React, { useEffect, useMemo, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import questions from '../../res/questions.json'

interface QuestionProps {
  id: number
  question: string
  options: string[]
  type: 'multiple-choice' | 'dropdown'
  section?: number
}

const Quest = () => {
  const [currentSection, setCurrentSection] = useState(1)
  const SECTIONS = 10
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [saving, setSaving] = useState(false)

  const chunkSize = Math.ceil(questions.length / SECTIONS)
  const questionsWithSection: QuestionProps[] = (questions as any).map((q: QuestionProps, idx: number) => {
    if (q.section && q.section >= 1 && q.section <= SECTIONS) return q
    const derivedSection = Math.min(Math.floor(idx / chunkSize) + 1, SECTIONS)
    return { ...q, section: derivedSection }
  })

  const sectionsToQuestions: Record<number, QuestionProps[]> = useMemo(() => {
    const map: Record<number, QuestionProps[]> = {}
    for (let s = 1; s <= SECTIONS; s++) {
      map[s] = questionsWithSection.filter(q => q.section === s)
    }
    return map
  }, [questionsWithSection])

  const visibleQuestions: QuestionProps[] = sectionsToQuestions[currentSection] || []
  const currentQuestion: QuestionProps | undefined = visibleQuestions[currentQuestionIndex]

  const isAnswered = (q?: QuestionProps) => {
    if (!q) return false
    const value = selectedAnswers[q.id]
    return typeof value === 'string' && value.trim() !== ''
  }

  const sectionAnsweredCounts = useMemo(() => {
    const counts: Record<number, { answered: number; total: number }> = {}
    for (let s = 1; s <= SECTIONS; s++) {
      const qs = sectionsToQuestions[s] || []
      const answered = qs.filter(q => isAnswered(q)).length
      counts[s] = { answered, total: qs.length }
    }
    return counts
  }, [sectionsToQuestions, selectedAnswers])

  const handleOptionSelect = (option: string) => {
    if (!currentQuestion) return
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: option
    })
  }

  const handleNext = () => {
    if (currentQuestionIndex < visibleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const allAnsweredInSection = visibleQuestions.every(q => isAnswered(q))
  const isLastQuestionInSection = currentQuestionIndex === visibleQuestions.length - 1
  const isFirstQuestionInSection = currentQuestionIndex === 0
  const isLastSection = currentSection === SECTIONS
  const isFirstSection = currentSection === 1

  const goToNextSection = async () => {
    // Save current section answers before moving on
    await saveCurrentSection()
    if (currentSection < SECTIONS) {
      setCurrentSection(currentSection + 1)
      setCurrentQuestionIndex(0)
    }
  }

  const goToPrevSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1)
      setCurrentQuestionIndex(0)
    }
  }

  const jumpToSection = (sectionNum: number) => {
    setCurrentSection(sectionNum)
    setCurrentQuestionIndex(0)
  }

  const handleRestart = () => {
    setCurrentSection(1)
    setCurrentQuestionIndex(0)
    setIsCompleted(false)
    loadExistingAnswers()
  }

  const saveCurrentSection = async () => {
    try {
      setSaving(true)
      let token = ''
      try {
        token = (await AsyncStorage.getItem('token')) ?? ''
      } catch {}
      const answersPayload: Record<number, string> = {}
      for (const q of visibleQuestions) {
        const v = selectedAnswers[q.id]
        if (typeof v === 'string' && v.trim() !== '') {
          answersPayload[q.id] = v
        }
      }
      const response = await fetch('http://kando.govt.hu:5000/quest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ answers: answersPayload })
      })
      if (!response.ok) throw new Error('Failed to save section')
    } catch (e) {
      // noop or show a toast in future
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async () => {
    try {
      let token = ''
      try {
        token = (await AsyncStorage.getItem('token')) ?? ''
      } catch {}
      const response = await fetch('http://kando.govt.hu:5000/quest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ answers: selectedAnswers })
      })
      if (!response.ok) {
        throw new Error('Failed to submit answers')
      }
      setIsCompleted(true)
    } catch (err) {
      alert('Failed to submit answers. Please try again.')
    }
  }

  const loadExistingAnswers = async () => {
    try {
      let token = ''
      try { token = (await AsyncStorage.getItem('token')) ?? '' } catch {}
      if (!token) return
      const response = await fetch('http://kando.govt.hu:5000/quest', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })
      if (!response.ok) return
      const data = await response.json()
      if (data.status === 'success' && data.answers) {
        setSelectedAnswers(data.answers)
      }
    } catch {}
  }

  useEffect(() => {
    loadExistingAnswers()
  }, [])

  const renderSectionSelector = () => {
    return (
      <View className="flex-row flex-wrap gap-2 mb-4">
        {Array.from({ length: SECTIONS }, (_, i) => i + 1).map((s) => {
          const c = sectionAnsweredCounts[s]
          const isCurrent = s === currentSection
          const complete = c?.answered > 0 && c?.answered === c?.total && c?.total > 0
          const partial = c?.answered > 0 && c?.answered < c?.total
          const bg = complete ? 'bg-success/20 border-success' : partial ? 'bg-warning/20 border-warning' : 'bg-surface border-surfaceElevated'
          const border = isCurrent ? 'border-2 border-primary' : 'border'
          return (
            <TouchableOpacity
              key={s}
              onPress={() => jumpToSection(s)}
              activeOpacity={0.8}
              className={`px-4 py-2.5 rounded-xl mb-2 ${bg} ${border}`}
            >
              <Text className={`font-semibold text-sm ${complete ? 'text-success' : partial ? 'text-warning' : 'text-textSecondary'}`}>
                {s} {complete ? '✓' : partial ? '•' : ''}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  const renderQuestion = () => {
    if (!currentQuestion) return null
    if (currentQuestion.type === 'dropdown') {
      return (
        <View className="bg-surface rounded-2xl p-4 mb-6 border border-surfaceElevated">
          <Picker
            selectedValue={selectedAnswers[currentQuestion.id] ?? ''}
            onValueChange={handleOptionSelect}
            style={{ color: '#FFFFFF' }}
          >
            <Picker.Item label="Select an option..." value="" />
            {currentQuestion.options.map((option, index) => (
              <Picker.Item key={index} label={option} value={option} />
            ))}
          </Picker>
        </View>
      )
    }

    return (
      <View className="space-y-3 mb-6">
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleOptionSelect(option)}
            activeOpacity={0.8}
            className={`p-4 rounded-2xl border ${
              selectedAnswers[currentQuestion.id] === option 
                ? 'bg-primary border-primary' 
                : 'bg-surface border-surfaceElevated'
            }`}
          >
            <Text className={`text-base font-semibold ${
              selectedAnswers[currentQuestion.id] === option 
                ? 'text-white' 
                : 'text-text'
            }`}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  if (isCompleted) {
    return (
      <View className="flex-1 bg-bg px-6 pt-16 justify-center items-center">
        <View className="bg-surface rounded-3xl p-8 w-full items-center border border-surfaceElevated">
          <Feather name="check-circle" size={72} color="#10B981" />
          <Text className="text-text text-3xl font-bold mt-6 mb-3 text-center">
            Survey Completed!
          </Text>
          <Text className="text-textSecondary text-lg mb-8 text-center leading-6">
            Thank you for completing all the questions. Your benefits are now being calculated.
          </Text>
          <TouchableOpacity
            onPress={handleRestart}
            activeOpacity={0.8}
            className="px-8 py-4 rounded-2xl bg-primary"
          >
            <Text className="text-white text-lg font-semibold">
              Start Over
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-bg">
      <ScrollView className="px-6 pt-16 pb-32">
        {renderSectionSelector()}
        <View className="mb-6">
          <Text className="text-text text-2xl font-bold mb-2">
            Section {currentSection} of {SECTIONS}
          </Text>
          <Text className="text-textSecondary text-base">
            Question {currentQuestionIndex + 1} of {visibleQuestions.length}
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-text text-xl leading-7 font-semibold">
            {currentQuestion?.question}
          </Text>
        </View>

        {renderQuestion()}
      </ScrollView>

      <View className="absolute bottom-8 right-6 left-6 flex-row justify-between bg-bg/95 backdrop-blur">
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={goToPrevSection}
            disabled={isFirstSection}
            activeOpacity={isFirstSection ? 1 : 0.8}
            className={`px-4 py-3 rounded-xl ${
              isFirstSection ? 'opacity-40' : ''
            } bg-surface border border-surfaceElevated`}
          >
            <Text className="text-text text-base font-semibold">Prev</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBack}
            disabled={isFirstQuestionInSection}
            activeOpacity={isFirstQuestionInSection ? 1 : 0.8}
            className={`px-4 py-3 rounded-xl ${
              isFirstQuestionInSection ? 'opacity-40' : ''
            } bg-surface border border-surfaceElevated`}
          >
            <Text className="text-text text-base font-semibold">Back</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={saveCurrentSection}
            activeOpacity={0.8}
            className={`px-4 py-3 rounded-xl bg-surface border border-surfaceElevated ${saving ? 'opacity-50' : ''}`}
            disabled={saving}
          >
            <Text className="text-text text-base font-semibold">Save</Text>
          </TouchableOpacity>

          {!isLastSection || !isLastQuestionInSection ? (
            <View className="flex-row">
              {!isLastQuestionInSection ? (
                <TouchableOpacity
                  onPress={handleNext}
                  disabled={!isAnswered(currentQuestion)}
                  activeOpacity={!isAnswered(currentQuestion) ? 1 : 0.8}
                  className={`px-5 py-3 rounded-xl bg-primary ${
                    !isAnswered(currentQuestion) ? 'opacity-50' : ''
                  }`}
                >
                  <Text className="text-white text-base font-semibold">Next</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={goToNextSection}
                  activeOpacity={0.8}
                  className="px-5 py-3 rounded-xl bg-primary"
                >
                  <Text className="text-white text-base font-semibold">Next →</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleSubmit}
              activeOpacity={0.8}
              className="px-5 py-3 rounded-xl bg-success"
            >
              <Text className="text-white text-base font-semibold">Submit</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}

export default Quest