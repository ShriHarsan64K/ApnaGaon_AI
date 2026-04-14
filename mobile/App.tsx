import React from 'react'
import { StatusBar } from 'react-native'
import AppNavigator from './src/navigation/AppNavigator'

export default function App() {
  return (
    <>
      <StatusBar
        translucent={false}
        backgroundColor="#ffffff"
        barStyle="dark-content"
      />
      <AppNavigator />
    </>
  )
}