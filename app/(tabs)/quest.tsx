import { Feather } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'
import React, { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import questions from '../../res/questions.json'
import AsyncStorage from '@react-native-async-storage/async-storage';

interface QuestionProps {
  id: number
  question: string
  options: string[]
  type: 'multiple-choice' | 'dropdown'
}

const Quest = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({})
  const [isCompleted, setIsCompleted] = useState(false)

  //@ts-ignore
  const currentQuestion: QuestionProps = questions[currentQuestionIndex]

  const handleOptionSelect = (option: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: option
    })
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const isLastQuestion = currentQuestionIndex === questions.length - 1

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setIsCompleted(false)
  }

  const handleSubmit = () => {
    setIsCompleted(true)
    return selectedAnswers
  }

  const renderQuestion = () => {
    if (currentQuestion.type === 'dropdown') {
      return (
        <View className="bg-dg rounded-lg p-4 mb-6">
          <Picker
            selectedValue={selectedAnswers[currentQuestion.id]}
            onValueChange={handleOptionSelect}
            style={{ color: '#ffffff' }}
          >
            <Picker.Item 
            label="Select a state..." value="" />
            {currentQuestion.options.map((option, index) => (
              <Picker.Item key={index} label={option} value={option} />
            ))}
          </Picker>
        </View>
      )
    }

    return (
      <View className="space-y-4 mb-6">
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleOptionSelect(option)}
            activeOpacity={0.9}
            className={`p-4 rounded-lg mt-3 ${
              selectedAnswers[currentQuestion.id] === option 
                ? 'bg-col2' 
                : 'bg-dg'
            }`}
          >
            <Text className={`text-lg font-semibold ${
              selectedAnswers[currentQuestion.id] === option 
                ? 'text-white' 
                : 'text-col1'
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
      <View className="flex-1 bg-col4 px-6 pt-16 justify-center items-center">
        <View className="bg-dg rounded-lg p-8 w-full items-center">
          <Feather name="check-circle" size={64} color="#4E4FEB" />
          <Text className="text-col1 text-3xl font-bold mt-6 mb-4 text-center">
            Survey Completed!
          </Text>
          <Text className="text-col2 text-lg mb-8 text-center">
            Thank you for completing all the questions.
          </Text>
          <TouchableOpacity
            onPress={handleRestart}
            activeOpacity={0.7}
            className="px-8 py-4 rounded-lg bg-[#4E4FEB]"
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
    <View className="flex-1 bg-col4">
      <ScrollView className="px-6 pt-16 pb-24">
        <View className="mb-8">
          <Text className="text-col1 text-3xl font-bold mb-2">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
          <Text className="text-col2 text-xl">
            {currentQuestion.question}
          </Text>
        </View>

        {renderQuestion()}
      </ScrollView>

      <View className="absolute bottom-8 right-6 flex-row space-x-4">
        <TouchableOpacity
          onPress={handleBack}
          disabled={currentQuestionIndex === 0}
          activeOpacity={currentQuestionIndex === 0 ? 1 : 0.8}
          className={`px-6 py-3 rounded-lg mx-2 ${
            currentQuestionIndex === 0 ? 'opacity-50' : ''
          } bg-dg`}
        >
          <Text className="text-col1 text-lg font-semibold">Back</Text>
        </TouchableOpacity>

        {!isLastQuestion ? (
          <TouchableOpacity
            onPress={handleNext}
            disabled={!selectedAnswers[currentQuestion.id]}
            activeOpacity={!selectedAnswers[currentQuestion.id] ? 1 : 0.8}
            className={`px-6 py-3 rounded-lg bg-[#4E4FEB] ${
              !selectedAnswers[currentQuestion.id] ? 'opacity-50' : ''
            }`}
          >
            <Text className="text-white text-lg font-semibold">Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!selectedAnswers[currentQuestion.id]}
            activeOpacity={!selectedAnswers[currentQuestion.id] ? 1 : 0.8}
            className={`px-6 py-3 rounded-lg bg-[#4E4FEB] ${
              !selectedAnswers[currentQuestion.id] ? 'opacity-50' : ''
            }`}
          >
            <Text className="text-white text-lg font-semibold">Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default Quest