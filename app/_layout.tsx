import './globals.css';
import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
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
  </Stack>
}