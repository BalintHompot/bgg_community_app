import React, { useState, useEffect, useGlobal } from 'reactn'
import Sentry from 'sentry-expo'
import { View, Text, StyleSheet, Linking, ScrollView, Image } from 'react-native'

import { createStackNavigator } from '@react-navigation/stack'
import CollectionScreen from './OtherUserCollection'

import ProfileCard from '../../../ProfileCard'



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

const ProfileScreen = props => {

  let [loading, setLoading] = useState(false)

  /// if there are no params, we are logging in, so we use the global username
  let userName = props.route.params.userName

  //console.log("props", props)
  //console.log(props.route.params)


  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

      <ProfileCard userName={userName} navigation={props.navigation.dangerouslyGetParent()} />
      <CollectionScreen insideScreen={true} lists={props.route.params.lists} />

    </View>
  )

}
const Stack = createStackNavigator()


export default () => (
  <Stack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: '#403c64',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }}>
    <Stack.Screen name="Profile" component={ProfileScreen} />


  </Stack.Navigator>
)
