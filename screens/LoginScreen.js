import React, { useState, useDispatch } from 'reactn'
import Sentry from 'sentry-expo'
import { View, Text, StyleSheet, Linking, ScrollView, Dimensions, ImageBackground, Image } from 'react-native'
import { Input, Button } from 'react-native-elements'
import { showMessage } from 'react-native-flash-message'
import SafeAreaView from 'react-native-safe-area-view'
import { createStackNavigator } from '@react-navigation/stack'
import { logIn, getUserId } from '../shared/auth'


import styles from '../shared/styles'

const height = Dimensions.get('screen').height

const customStyles = StyleSheet.create({
  text: {
    paddingHorizontal: 20,
    paddingVertical: 10
  },

  stateText: {
    paddingVertical: 20
  },

  bottomText: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20
  },

  buttonContainer: {
    paddingVertical: 30
  },

  button: {
    alignSelf: 'center',
    width: '100%'
  },

  strong: {
    fontWeight: 'bold'
  }
})

const LoginScreen = props => {

  let [username, setUsername] = useState("")
  let [usernameError, setUsernameError] = useState(null)

  let [password, setPassword] = useState("")
  let [passwordError, setPasswordError] = useState(null)

  let [loading, setLoading] = useState(false)
  let [message, setMessage] = useState(null)

  const dispatch = useDispatch()


  const usernameChange = username => {
    setUsername(username)
  }

  const passwordChange = password => {
    setPassword(password)
  }

  const showFlash = (message, type = 'danger') => {
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
            lastname
          }



          dispatch.setCredentials(bggCredentials)
          global.username = username


          props.navigation.navigate("MainTabWrapper", {
            screen: "mainTab", params: {
              screen: 'ProfileStack',
              params: {
                screen: 'Profile',
                params: {
                  userName: username, isSelf: true

                }
              },
            }
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
      showFlash('Unexpected error logging in, please try again.')
      console.warn(error)
      //Sentry.captureException(error)
    }
  }


  return (
    <ImageBackground source={require("../assets/loginBackground.jpg")} style={{ width: '100%', height: '100%' }}>

      <View style={{ alignItems: 'center', padding: 10, flex: 1, backgroundColor: 'rgba(1,1,1,0.4)' }}>
        <Image source={require('../assets/BGG-Logo-removebg.png')} style={{ width: 150, height: 150, marginTop: 100, marginBottom: 20 }} />

        <Input
          id="usernameInput"
          label="BGG Username"
          focus={true}
          autoCapitalize={'none'}
          autoCorrect={false}
          spellCheck={false}
          onChangeText={usernameChange}
          value={username}
          errorMessage={usernameError}
          containerStyle={{ backgroundColor: 'rgba(1,1,1,0.5)', padding: 20, borderRadius: 15 }}
          inputStyle={{ color: 'white' }}
          labelStyle={{ color: 'white' }}
        />

        <Input
          id="passwordInput"
          label="BGG Password"
          autoCapitalize="none"
          containerStyle={{ marginTop: 25 }}
          onChangeText={passwordChange}
          secureTextEntry={true}
          value={password}
          errorMessage={passwordError}
          containerStyle={{ backgroundColor: 'rgba(1,1,1,0.5)', padding: 20, borderRadius: 15 }}
          inputStyle={{ color: 'white' }}
          labelStyle={{ color: 'white' }}
        />
        <View style={[customStyles.buttonContainer, { width: '100%' }]}>
          <Button
            id="submitButton"
            backgroundColor="#03A9F4"
            style={customStyles.button}
            onPress={
              handleLogIn
            }
            loading={loading}
            title={'Sign In'}
          />
        </View>

        <View >
          <Text style={{ color: 'white' }}>
            This app is an <Text style={customStyles.strong}>unofficial</Text>{' '}
            {' '}
              community initiative to build a sharing mobile application
              for the amazing BoardGameGeek.com site.
            </Text>
          <Text></Text>
          <Text style={{ color: 'white' }}>
            Geekdo, BoardGameGeek, the Geekdo logo, and the BoardGameGeek
            logo are trademarks of BoardGameGeek, LLC.
              </Text>
        </View>
      </View>
    </ImageBackground>
  )

}
const Stack = createStackNavigator()

export default () => (
  <Stack.Navigator >
    <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
  </Stack.Navigator>
)
