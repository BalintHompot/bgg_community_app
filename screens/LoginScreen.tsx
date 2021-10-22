import { createStackNavigator } from '@react-navigation/stack'
import * as SecureStore from 'expo-secure-store'
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View
} from 'react-native'
import { Button, Input } from 'react-native-elements'
import { MessageType, showMessage } from 'react-native-flash-message'
import React, { useDispatch, useState } from 'reactn'
import { Native as Sentry } from 'sentry-expo'
import { getUserId, logIn } from '../shared/auth'
import { setCredentialsReducer } from '../shared/store/reducers/authorization'
import { getNumUnreadReducer } from '../shared/store/reducers/geekmail/fetchUnreadCount'
import styleconstants from '../shared/styles/styleconstants'

const height = Dimensions.get('screen').height

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
  }
}

const customStyles = StyleSheet.create({
  text: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  stateText: {
    paddingVertical: 20,
  },

  bottomText: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },

  buttonContainer: {
    paddingVertical: 30,
  },

  button: {
    alignSelf: 'center',
    width: '100%',
  },

  strong: {
    fontWeight: 'bold',
  },
})

const LoginScreen = (props) => {
  let [username, setUsername] = useState('')
  let [usernameError, setUsernameError] = useState(null)

  let [password, setPassword] = useState('')
  let [passwordError, setPasswordError] = useState(null)

  let [loading, setLoading] = useState(false)

  const setCredentials = useDispatch(setCredentialsReducer)
  const getNumUnread = useDispatch(getNumUnreadReducer)

  const usernameChange = (username) => {
    setUsername(username)
  }

  const passwordChange = (password) => {
    setPassword(password)
  }

  const showFlash = (message, type: MessageType = 'danger') => {
    showMessage({ message, type, icon: 'auto' })
  }

  const handleLogIn = () => {
    let valid = true

    if (username == '') {
      valid = false
      setUsernameError('Username is required')
    }

    if (password == '') {
      valid = false
      setPasswordError('Password is required')
    }

    if (valid) {
      setLoading(true)
      attemptBGGLogin(username, password)
    }
  }

  const attemptBGGLogin = async (username, password) => {
    try {
      SecureStore.setItemAsync('userName', username)
      SecureStore.setItemAsync('userPassword', password)

      const { success } = await logIn(username, password)

      setLoading(false)

      if (success) {
        const { userid, firstname, lastname } = await getUserId()

        if (userid > 0) {
          showFlash(`Successfully signed in as ${username}.`, 'success')

          const bggCredentials = {
            username,
            userid,
            firstname,
            lastname,
          }

          await getNumUnread()

          setCredentials(bggCredentials)

          props.navigation.navigate('MainTabWrapper', {
            screen: 'mainTab',
            params: {
              screen: 'Home',
            },
          })
        } else {
          showFlash(
            'Failed to get user data while logging in, please try again.'
          )
        }
      } else {
        showFlash(
          'Username or password was incorrect, please try again.',
          'warning'
        )
      }
    } catch (error) {
      setLoading(false)
      showFlash('Unexpected error logging in, please try again.')
      console.warn(error)
      Sentry.captureException(error)
    }
  }

  const InnerScreen = (
    <View
      style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
    >
      <View
        style={{
          alignItems: 'center',
          padding: 10,
          flex: 1,
          backgroundColor: 'transparent',
        }}
      >
        <KeyboardAvoidingView
          style={{ width: '100%', flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
        >
          <View
            style={{
              justifyContent: 'flex-end',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <View
              style={{
                marginTop: 100,
                marginBottom: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                source={require('../assets/BGG-community-removebg.png')}
                style={{ width: 150, height: 150, marginBottom: 10 }}
              />
              <Text
                style={{
                  fontFamily: styleconstants.primaryFontBold,
                  fontSize: 20,
                }}
              >
                Board Game Community App
              </Text>
            </View>

            <View
              style={{
                backgroundColor: 'rgba(1,1,1,0.5)',
                padding: 20,
                borderRadius: 15,
                width: '100%',
              }}
            >
              <Input
                label="BGG Username"
                autoCapitalize={'none'}
                autoCorrect={false}
                spellCheck={false}
                onChangeText={usernameChange}
                value={username}
                errorMessage={usernameError}
                containerStyle={{ padding: 15 }}
                inputStyle={{ color: 'white' }}
                labelStyle={{ color: 'white' }}
              />

              <Input
                label="BGG Password"
                autoCapitalize="none"
                containerStyle={{ marginTop: 25, padding: 15 }}
                onChangeText={passwordChange}
                secureTextEntry={true}
                value={password}
                errorMessage={passwordError}
                inputStyle={{ color: 'white' }}
                labelStyle={{ color: 'white' }}
              />
            </View>
            <View style={[customStyles.buttonContainer, { width: '100%' }]}>
              <Button
                style={customStyles.button}
                onPress={handleLogIn}
                loading={loading}
                title={'Sign In'}
                buttonStyle={{ backgroundColor: styleconstants.bggpurple }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
        <View style={{ marginBottom: '30%' }}>
          <Text style={{ color: 'black' }}>
            This app is an <Text style={customStyles.strong}>unofficial</Text>{' '}
            initiative to build a community application based on the amazing
            BoardGameGeek.com site.
          </Text>
          <Text></Text>
          <Text style={{ color: 'black' }}>
            Geekdo, BoardGameGeek, the Geekdo logo, and the BoardGameGeek logo
            are trademarks of BoardGameGeek, LLC.
          </Text>
        </View>
      </View>
    </View>
  )

  let InnerWrapped

  if (Platform.OS === 'ios') {
    InnerWrapped = <View>{InnerScreen}</View>
  } else {
    InnerWrapped = <ScrollView>{InnerScreen}</ScrollView>
  }

  return (
    <View style={{ backgroundColor: 'white' }}>
      <Image
        source={require('../assets/bgg_background_1.png')}
        style={{
          position: 'absolute',
          bottom: 0,
          height: height,
          width: 300,
          left: 0,
        }}
      />
      <Image
        source={require('../assets/bgg_background_2.png')}
        style={{
          position: 'absolute',
          bottom: 0,
          height: height / 3,
          width: 100,
          right: 0,
        }}
      />

      {InnerWrapped}
    </View>
  )
}
const Stack = createStackNavigator()

export default () => (
  <Stack.Navigator>
    <Stack.Screen
      options={{ headerShown: false }}
      name="Login"
      component={LoginScreen}
    />
  </Stack.Navigator>
)
