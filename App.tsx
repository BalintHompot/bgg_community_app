import AsyncStorage from '@react-native-community/async-storage'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { getFocusedRouteNameFromRoute, NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AppLoading from 'expo-app-loading'
import * as Font from 'expo-font'
import * as SecureStore from 'expo-secure-store'
import { View } from 'react-native'
import { SENTRY_CONFIG } from 'react-native-dotenv'
import { Badge } from 'react-native-elements'
import FlashMessage from 'react-native-flash-message'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import React, { useDispatch, useState } from 'reactn'
import * as Sentry from 'sentry-expo'
import CollectionScreen from './screens/Collection/CollectionScreen'
import HomeScreen from './screens/Home/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import MessagesScreen from './screens/Mail/MessagesScreen'
import ProfileScreen from './screens/OwnProfileScreen'
import { logIn } from './shared/auth'
import { getNumUnread } from './shared/FetchWithCookie'
import { findCoordinates } from './shared/location'
import { setupStore } from './shared/store'

Sentry.init({
  dsn: SENTRY_CONFIG,
  enableInExpoDevelopment: false,
  debug: true,
})

//bootstraps ReactN global store
setupStore()

// @ts-ignore
const App = () => {
  const [isReady, setIsReady] = useState(false)
  const [userDetails, setUserDetails] = useState(false)

  const attemptBGGLoginInBackground = async (username, password) => {
    if (username && password) {
      try {
        const { success } = await logIn(username, password)

        if (success) {
          setUserDetails(true)
          await getNumUnread()
        }
      } catch (error) {
        console.warn(error)
        Sentry.captureException(error)
      }
    }
  }

  const fireUp = async () => {
    // load fonts, so they are ready for rendering
    await Font.loadAsync({
      lato: require('./assets/Lato-Regular.ttf'),
      'lato-bold': require('./assets/Lato-Bold.ttf'),
    })
    let valueName = await AsyncStorage.getItem('userName')
    let valuePassword = await AsyncStorage.getItem('userPassword')
    //// we need to migrate in the background from async storage to kaychain
    if (valueName && valuePassword) {
      AsyncStorage.removeItem('userName')
      AsyncStorage.removeItem('userPassword')

      SecureStore.setItemAsync('userName', valueName)
      SecureStore.setItemAsync('userPassword', valuePassword)
    } else {
      valueName = await SecureStore.getItemAsync('userName')
      valuePassword = await SecureStore.getItemAsync('userPassword')
    }

    await attemptBGGLoginInBackground(valueName, valuePassword)

    //global.location = { "city": "Utrecht", "country": "Netherlands" }

    findCoordinates()

    /// async fetch collection
    const fetchCollection = useDispatch('fetchCollection')
    fetchCollection()
  }

  const renderTabs = () => {
    function getTabBarVisibility(route) {
      const routeName = getFocusedRouteNameFromRoute(route)
      return !['Conversation', 'Compose'].includes(routeName)
    }
    
    const Tab = createBottomTabNavigator()
    const Drawer = createStackNavigator()

    const mainTabNav = () => {
      return (
        <Tab.Navigator backBehavior="none" initialRouteName="Home">
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={({ route }) => ({
              tabBarVisible: getTabBarVisibility(route),
              tabBarLabel: 'Home',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
            })}
          />

          <Tab.Screen
            name="Geekmail"
            component={MessagesScreen}
            options={({ route }) => ({
              tabBarVisible: getTabBarVisibility(route),
              tabBarLabel: 'Geekmail',
              tabBarIcon: ({ color, size }) => (
                <View>
                  <Ionicons name="ios-mail-outline" size={size} color={color} />
                  {global.numUnread > 0 ? (
                    <Badge
                      status="error"
                      containerStyle={{
                        position: 'absolute',
                        top: -4,
                        right: -4,
                      }}
                      value={global.numUnread}
                    />
                  ) : null}
                </View>
              ),
            })}
          />
          <Tab.Screen
            name="Collection"
            component={CollectionScreen}
            options={{
              tabBarLabel: 'Collection',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="ios-albums" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="ProfileStack"
            component={ProfileScreen}
            options={{
              tabBarLabel: 'Account',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="ios-person" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      )
    }

    const mainTabWrapperStack = createStackNavigator()
    const mainTabWrapper = () => {
      return (
        <mainTabWrapperStack.Navigator initialRouteName="mainTab">
          <mainTabWrapperStack.Screen
            options={{ headerShown: false }}
            name="mainTab"
            component={mainTabNav}
          />
        </mainTabWrapperStack.Navigator>
      )
    }

    return (
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName={userDetails ? 'MainTabWrapper' : 'Login'}
        >
          <Drawer.Screen
            options={{ headerShown: false }}
            name="Login"
            component={LoginScreen}
          />
          <Drawer.Screen
            options={{ headerShown: false }}
            name="MainTabWrapper"
            component={mainTabWrapper}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    )
  }

  if (!isReady) {
    return (
      <AppLoading
        startAsync={fireUp}
        onFinish={() => {
          setIsReady(true)
        }}
        onError={console.warn}
      />
    )
  } else {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          {renderTabs()}
          <FlashMessage position="top" />
        </View>
      </SafeAreaProvider>
    )
  }
}

export default App
