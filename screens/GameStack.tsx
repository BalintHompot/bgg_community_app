import { createStackNavigator } from '@react-navigation/stack'
import React from 'reactn'
import GameAddTo from './GameAddTo'
import GameScreen from './GameScreen'
import GameSearch from './GameSearch'
import ListPlays from './Plays/List'
import LogPlay from './Plays/Log'

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
    <Stack.Screen
      name="Game"
      component={GameScreen}
     
      options={({ route }) => ({ headerTitle: route.params.game.name, headerBackTitle: "Back" })}
    />
    <Stack.Screen name="Search" component={GameSearch} />
    <Stack.Screen name="AddTo" component={GameAddTo} />
    <Stack.Screen name="LogPlay" component={LogPlay} />
    <Stack.Screen name="ListPlays" component={ListPlays} />
  </Stack.Navigator>
)
