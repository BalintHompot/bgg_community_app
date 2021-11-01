import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { Button, Icon } from 'react-native-elements'
import React from 'reactn'
import globalStyles from '../../shared/styles'
import styleconstants from '../../shared/styles/styleconstants'
import ForumScreen from '../Forum/ForumScreen'
import GameStack from '../GameStack'
import ConversationScreen from '../Mail/ConversationScreen'
import { ModalWebScreen } from '../ModalWebScreen'
import ExploreScreen from './Explore'
import MeetScreen from './MoreComponents/Meet/MeetScreen'
import PreviewScreen from './MoreComponents/PreviewScreen'
import MoreScreen from './MoreScreen'

const Tab = createMaterialTopTabNavigator()
const StackTabWrapper = createStackNavigator()
const Stack = createStackNavigator()

const tabNav = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        indicatorStyle: {
          backgroundColor: styleconstants.bggorange,
          height: 3,
        },
        labelStyle: { fontFamily: styleconstants.primaryFontBold },
      }}
    >
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  )
}

const tabNavWrapped = (props) => {
  return (
    <StackTabWrapper.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: styleconstants.bggpurple,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => (
          <Button
            icon={
              <Icon name="search" type="ionicons" size={20} color={'white'} />
            }
            onPress={() =>
              props.navigation.navigate('GameStack', { screen: 'Search' })
            }
            buttonStyle={globalStyles.headerIconButton}
          />
        ),
      }}
    >
      <StackTabWrapper.Screen name="Home" component={tabNav} />
    </StackTabWrapper.Navigator>
  )
}

export default () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: styleconstants.bggpurple,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={tabNavWrapped}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="GameStack"
        component={GameStack}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Preview"
        component={PreviewScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Gamers nearby"
        component={MeetScreen}
      />
      <Stack.Screen

        name="Forum"
        component={ForumScreen}
         options={({ route }) => ({
          title: route.params.forumName
        })}
      />

      <Stack.Screen
        name="Compose"
        component={ConversationScreen}
        options={({ route }) => ({
          title: route.params.subject,
        })}
      />

      <Stack.Screen name="ModalWeb" options={{title: ''}} component={ModalWebScreen} />
    </Stack.Navigator>
  )
}
