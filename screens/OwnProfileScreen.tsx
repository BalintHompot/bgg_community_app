import { createStackNavigator } from '@react-navigation/stack'
import {
  ScrollView, StyleSheet, Text, View
} from 'react-native'
import { Button } from 'react-native-elements'
import React, { useDispatch, useGlobal, useState } from 'reactn'
import { logOutReducer } from '../shared/store/reducers/authorization'
import styles from '../shared/styles'
import ProfileCard from './ProfileCard'


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

const ProfileScreen = (props) => {
  let [loading] = useState(false)

  const [bggCredentials] = useGlobal('bggCredentials')
  const logOut = useDispatch(logOutReducer)

  const handleLogOut = () => {
    //tells global store we've logged in
    props.navigation.navigate('Login')
    logOut()
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ScrollView>
        <View style={[styles.mainView, { marginTop: 30 }]}>
          <ProfileCard username={bggCredentials.username} />

          <View style={customStyles.buttonContainer}>
            <Button
              id="submitButton"
              backgroundColor="#03A9F4"
              style={customStyles.button}
              onPress={handleLogOut}
              loading={loading}
              title={'Sign Out'}
            />
          </View>
          <View>
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
      </ScrollView>
    </View>
  )
}
const Stack = createStackNavigator()

export default () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#403c64',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
)
