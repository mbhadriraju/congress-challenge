import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState, useRef } from 'react'
import Login from './login'
import Signup from './signup'

const { width } = Dimensions.get('window')

const slides = [
  {
    key: '1',
    title: 'Welcome to BenePro',
    subtitle: 'Unlock the benefits you deserve — quick, simple, personalized.',
  },
  {
    key: '2',
    title: 'Your Benefits, Your Way',
    subtitle: 'Answer a few simple questions — no jargon, no stress.',
  },
  {
    key: '3',
    title: 'See What You Qualify For',
    subtitle: 'Personalized benefit recommendations, tailored just for you.',
  },
  {
    key: 'login',
    isLogin: true,
  },
  {
    key: 'signup',
    isSignup: true,
  }
]

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollRef = useRef<ScrollView>(null)

  const onNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (currentIndex + 1), animated: true })
    }
  }

  const onBack = () => {
    const dec = currentIndex === slides.length - 1 ? 2 : 1
    console.log(dec)
    if (currentIndex > 0) {
      scrollRef.current?.scrollTo({ x: width * (currentIndex - dec), animated: currentIndex < slides.length - 2 })
    }
  }

  const goToLogin = () => {
    const loginIdx = slides.findIndex(s => s.isLogin)
    scrollRef.current?.scrollTo({ x: width * loginIdx, animated: false })
    setCurrentIndex(loginIdx)
  }

  const goToSignup = () => {
    const signupIdx = slides.findIndex(s => s.isSignup)
    scrollRef.current?.scrollTo({ x: width * signupIdx, animated: false })
    setCurrentIndex(signupIdx)
  }

  const onScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width)
    setCurrentIndex(slideIndex)
  }

  return (
    <View className="flex-1 bg-col4">
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        ref={scrollRef}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {slides.map((slide, idx) => (
          <View
            key={slide.key}
            style={{
              width,
              marginTop: slide.isLogin || slide.isSignup ? 0 : 150,
              alignItems: slide.isLogin || slide.isSignup ? undefined : 'center',
              paddingHorizontal: slide.isLogin || slide.isSignup ? 0 : 50
            }}
          >
            {slide.isLogin ? (
              <Login goToSignup={goToSignup} />
            ) : slide.isSignup ? (
              <Signup goToLogin={goToLogin} />
            ) : (
              <>
                <Text className="text-white text-4xl font-bold mb-4 text-center">{slide.title}</Text>
                <Text className="text-col2 text-xl text-center">{slide.subtitle}</Text>
              </>
            )}
          </View>
        ))}
      </ScrollView>
      <View className="flex-row justify-between items-center px-6 py-4">
        <TouchableOpacity
          onPress={onBack}
          disabled={currentIndex === 0}
          className={`bg-dg rounded-2xl px-10 py-3 text-lg mb-5 ml-5 ${currentIndex === 0 ? 'opacity-50' : ''}`}
        >
          <Text className="text-col1 font-bold text-lg">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onNext}
          disabled={currentIndex === slides.length - 2}
          className={`bg-col3 rounded-2xl px-10 py-3 mb-5 mr-5 ${currentIndex > slides.length - 3 ? 'opacity-50' : ''}`}
        >
          <Text className="text-col1 font-bold text-lg">
            {currentIndex === slides.length - 3 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}