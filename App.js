import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, ActivityIndicator } from "react-native"
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth'; 
import Chat from './screens/Chat';
import Login from "./screens/Login"
import Signup from "./screens/Signup"
import Home from "./screens/Home"
import { auth } from './config/firebase';

const Stack = createStackNavigator()
const AuthenticatedUserContext = createContext({})

const AuthenticatedUserProvider = ({children}) => {
  const [user, setUser] = useState(null)
  return (
    <AuthenticatedUserContext.Provider value={{user,setUser}}>
      {children}
    </AuthenticatedUserContext.Provider>
  )
}

function AuthStack() {
  return (
    <Stack.Navigator defaultScreenOptions={Login} screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  )
}

function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{headerTitleAlign: "center"}} >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  )
}

function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, 
      async authenticatedUser => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null)
        setIsLoading(false)
      })
      return () => unsubscribe()
  },[user])
  
  if(isLoading){
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      { user ? <ChatStack /> : <AuthStack />}
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}
