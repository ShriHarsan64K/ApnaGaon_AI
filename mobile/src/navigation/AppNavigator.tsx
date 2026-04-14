import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import HomeScreen from '../screens/HomeScreen'
import CropScreen from '../screens/CropScreen'
import MandiScreen from '../screens/MandiScreen'
import SchemeScreen from '../screens/SchemeScreen'

const Stack = createStackNavigator()

export default function AppNavigator() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#f5f7f5' }
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Crop" component={CropScreen} />
          <Stack.Screen name="Mandi" component={MandiScreen} />
          <Stack.Screen name="Scheme" component={SchemeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}