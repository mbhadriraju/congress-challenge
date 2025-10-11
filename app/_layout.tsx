import { Stack } from "expo-router"
import AuthProvider from "./context/AuthProvider"
import './globals.css'

export default function RootLayout() {
  return ( 
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="spec/[id]"
          options={{
            headerTitle: '',
            headerTransparent: true,
            headerBackVisible: true,
            headerTintColor: '#4E4FEB', 
            headerBackTitle: "Back"
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            headerTransparent: true,
            headerBackVisible: false,
            headerTitle: "",
            animation: "none", 
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            headerTransparent: true,
            headerBackVisible: false,
            headerTitle: "",
            animation: "none", 
          }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            headerTransparent: true,
            headerBackVisible: false,
            headerTitle: "",
            animation: "none", 
          }}
        />
        <Stack.Screen
          name="change-password"
          options={{
            headerTitle: '',
            headerTransparent: true,
            headerBackVisible: true,
            headerTintColor: '#4E4FEB', 
            headerBackTitle: "Back"
          }}
        />
      </Stack>
    </AuthProvider>
  )
}