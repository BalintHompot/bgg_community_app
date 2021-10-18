import React, {
  useGlobal,
  useEffect,
  useState,
  useDispatch,
  useRef,
} from 'reactn'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  InteractionManager,
  ScrollView,
  FlatList,
  LayoutAnimation,
  Keyboard,
} from 'react-native'
import { Button } from 'react-native-elements'
import { createStackNavigator } from '@react-navigation/stack'
import SafeAreaView from 'react-native-safe-area-view'
import * as Sentry from 'sentry-expo'

import styleconstants, {
  layoutAnimation,
} from '../../../../shared/styles/styleconstants'
import styles from '../../../../shared/styles'
import { SearchBar, Icon } from 'react-native-elements'
var DomParser = require('react-native-html-parser').DOMParser
import { fetchCollectionFromBGG } from '../../../../shared/bgg/collection'
import { BarIndicator } from 'react-native-indicators'
import { RateLimit } from 'async-sema'
import { useFocusEffect } from '@react-navigation/native'
import DropDownPicker from 'react-native-dropdown-picker'

import UserThumbNail from '../../../../components/UserThumbNail'
import GameStack from '../../../GameStack'
import ProfileStack from '../OtherProfileScreen'
import ForumScreen from './ForumScreen'
import ReplyScreen from './ReplyScreen'

import globalStyles from '../../../../shared/styles'
import { fetchXML } from '../../../../shared/HTTP'
import { TouchableOpacity } from 'react-native-gesture-handler'
var parseString = require('react-native-xml2js').parseString

const COMPONENTS_PER_PAGE = 15

const requestHeaders = new Headers({
  Accept: 'application/json',
  'Content-Type': 'application/json;charset=UTF-8',
})
const fetchArgs = {
  method: 'GET',
  credentials: 'include',
  requestHeaders,
}

let usersPageIndex = 1

let pageNumToRender = 1
let maxPageNumToRender = 1

let filterStringSync = ''

let initialFetchStarted = false
let fetchedGameGroups = []

const GameGroupThumbnail = (props) => {
  return (
    <TouchableOpacity
      style={{ padding: 20, backgroundColor: 'white', margin: 3 }}
      onPress={() => {
        props.navigation.navigate('Thread', { thread: props.thread })
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontFamily: styleconstants.primaryFontBold,
            color: 'dodgerblue',
          }}
        >
          {props.thread.author}
        </Text>
        <View style={{ width: '30%' }}>
          <Text style={{ color: 'grey' }}>
            {props.thread.lastpostdate.split('+')[0]}
          </Text>
        </View>
      </View>
      <Text
        style={{ fontFamily: styleconstants.primaryFontBold, fontSize: 17 }}
      >
        {props.thread.subject}
      </Text>
      <View
        style={{ marginTop: 20, alignItems: 'center', flexDirection: 'row' }}
      >
        <Icon
          name="chat"
          color={styleconstants.bggorange}
          type="entypo"
          containerStyle={{ margin: 4 }}
          size={18}
        />
        <Text>{props.thread.numarticles}</Text>
      </View>
    </TouchableOpacity>
  )
}

const GameGroupScreen = ({ navigation, route }) => {
  const scrollRef = useRef()

  let [threads, setThreads] = useState([])
  let [searchOpen, setSearchOpen] = useState(false)

  let [filterString, setFilterstring] = useState('')
  let [fetchingOnGoing, setFetchingOnGoing] = useState(false)

  const [open, setOpen] = useState(false)
  const [countryValue, setCountryValue] = useState(null)
  const [countries, setCountries] = useState([
    { label: 'Hungary', value: '99' },
    { label: 'Netherlands', value: '120' },
  ])

  let [gameGroups, setGameGroups] = useState([])

  const scrollUp = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    })
  }

  async function fetchLocalGameGroups(country) {
    setFetchingOnGoing(true)
    // getting user info
    console.log('fetching game group')
    const url =
      'https://boardgamegeek.com/xmlapi2/forum?id=' +
      country +
      '&page=' +
      pageNumToRender

    const gn = await fetchXML(url, { method: 'GET' })
    console.log('game group text', gn)
    parseString(gn, function (err, result) {
      console.log('xml parsed', result)
      console.log('game group list', result.forum.threads[0].thread.length)
      maxPageNumToRender = Math.ceil(result.forum['$'].numthreads / 50)
      setGameGroups(filterThreads(result.forum.threads[0].thread))
      setFetchingOnGoing(false)
    })
  }

  function filterThreads(threads) {
    if (filterString !== '') {
      let filteredThreads = threads.filter((item) =>
        item['$'].subject.includes(filterString)
      )
      return filteredThreads
    } else {
      return threads
    }
  }

  function findCountry(country) {
    for (const r in countries) {
      console.log('country', r)
      if (countries[r].label === country) {
        return countries[r]
      }
    }
  }

  function proceedFetchingGameGroups() {
    if (global.location) {
      let startCountry = findCountry(global.location.country)
      setCountryValue(startCountry.value)
      //setCity("Utrecht")
      //setCountry("Netherlands")
      fetchLocalGameGroups(startCountry.value)
      //fetchLocalUsers("Germany", "Gevelsberg")
    } else {
      console.log('still waiting for location')
      setTimeout(() => {
        proceedFetchingGameGroups()
      }, 1000)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <Button
            icon={
              <Icon name="search" type="ionicons" size={20} color={'white'} />
            }
            onPress={() => {
              layoutAnimation()
              setSearchOpen(!searchOpen)
            }}
            buttonStyle={globalStyles.headerIconButton}
          />
        ),
      })
      if (!initialFetchStarted && filterStringSync === '') {
        initialFetchStarted = true
        proceedFetchingGameGroups()
      }
    }, [])
  )

  return (
    <View>
      <View>
        <View style={{ marginTop: 70 }}>
          {searchOpen ? (
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <SearchBar
                onChangeText={(t) => {
                  setFilterstring(t)
                  filterStringSync = t.toLowerCase()
                  layoutAnimation()
                  setGameGroups(filterThreads(gameGroups))
                }}
                onClearText={(t) => {
                  setFilterstring('')
                  filterStringSync = ''
                  layoutAnimation()
                  setGameGroups(filterThreads(gameGroups))
                }}
                placeholder="Search threads..."
                value={filterString}
                containerStyle={{
                  width: '100%',
                  backgroundColor: styleconstants.bggpurple,
                }}
                inputContainerStyle={{ backgroundColor: 'white' }}
                // showLoadingIcon={true}
              />
            </View>
          ) : null}
        </View>
        <View>
          {global.location ? (
            <View>
              <ScrollView
                automaticallyAdjustContentInsets={true}
                ref={scrollRef}
              >
                {gameGroups.length < 1 ? (
                  <View
                    style={{
                      height: 200,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {fetchingOnGoing ? (
                      <Text>Loading...</Text>
                    ) : (
                      <Text>No results on this page</Text>
                    )}
                  </View>
                ) : (
                  <FlatList
                    data={gameGroups}
                    renderItem={({ item }) => {
                      return (
                        <GameGroupThumbnail
                          thread={item.$}
                          navigation={navigation}
                        />
                      )
                    }}
                  />
                )}
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      justifyContent: 'space-evenly',
                      marginTop: 20,
                      alignItems: 'center',
                    }}
                  >
                    <Icon
                      name="caretleft"
                      color={
                        pageNumToRender > 1
                          ? styleconstants.bggorange
                          : 'lightgrey'
                      }
                      type="antdesign"
                      containerStyle={{ margin: 4 }}
                      size={20}
                      onPress={() => {
                        if (pageNumToRender > 1) {
                          layoutAnimation()
                          pageNumToRender -= 1
                          fetchLocalGameGroups(countryValue)
                          scrollUp()
                        }
                      }}
                    />

                    <Text>
                      {pageNumToRender.toString() + '/' + maxPageNumToRender}
                    </Text>

                    <Icon
                      name="caretright"
                      color={
                        pageNumToRender < maxPageNumToRender
                          ? styleconstants.bggorange
                          : 'lightgrey'
                      }
                      type="antdesign"
                      containerStyle={{ margin: 4 }}
                      size={20}
                      onPress={() => {
                        if (pageNumToRender < maxPageNumToRender) {
                          layoutAnimation()
                          pageNumToRender += 1
                          fetchLocalGameGroups(countryValue)
                          scrollUp()
                        }
                      }}
                    />
                  </View>
                </View>
                <View style={{ height: 400 }}></View>
              </ScrollView>
            </View>
          ) : (
            <View
              style={{
                height: 600,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text>Detecting your location...</Text>
            </View>
          )}
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 70,
          backgroundColor: styleconstants.bggpurple,
        }}
      ></View>
      <View
        style={{
          padding: 5,
          position: 'absolute',
          top: 0,
          left: 0,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <View style={{ width: '99%', height: 60 }}>
          <DropDownPicker
            open={open}
            value={countryValue}
            items={countries}
            setOpen={setOpen}
            setValue={setCountryValue}
            setItems={setCountries}
            style={{ borderRadius: 5 }}
            containerStyle={{ borderWidth: 0 }}
            onChangeValue={(value) => {
              pageNumToRender = 1
              fetchLocalGameGroups(value)
            }}
            textStyle={{
              fontFamily: styleconstants.primaryFont,
            }}
            placeholder="Select a country"
            searchContainerStyle={{
              borderBottomColor: '#dfdfdf',
            }}
            searchTextInputStyle={{
              color: '#000',
            }}
          />
        </View>
      </View>

      {global.location && (
        <View
          style={{
            position: 'absolute',
            bottom: 100,
            right: 20,
            flexDirection: 'row',
          }}
        >
          <View
            style={{
              backgroundColor: styleconstants.bggorange,
              padding: 10,
              shadowColor: '#000',
              borderRadius: 5,
            }}
          >
            <TouchableOpacity>
              <Icon
                name="notification"
                type="entypo"
                size={20}
                color={'white'}
                containerStyle={{ margin: 4 }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor: styleconstants.bggorange,
              padding: 10,
              marginLeft: 15,
              shadowColor: '#000',
              borderRadius: 5,
            }}
          >
            <TouchableOpacity>
              <Icon
                name="plus"
                color="white"
                type="entypo"
                containerStyle={{ margin: 4 }}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {fetchingOnGoing && (
        <View
          style={{
            position: 'absolute',
            top: 80,
            width: '100%',
            justifyContent: 'center',
          }}
        >
          <BarIndicator size={15} color={styleconstants.bggorange} count={5} />
        </View>
      )}
    </View>
  )
}

const Stack = createStackNavigator()

export default () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: styleconstants.bggpurple,
        shadowColor: styleconstants.bggpurple,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen
      options={{ headerShown: true }}
      name="Game Groups"
      component={GameGroupScreen}
    />
    <Stack.Screen
      options={{ headerShown: false }}
      name="GameStack"
      component={GameStack}
    />
    <Stack.Screen
      options={{ headerShown: false }}
      name="User"
      component={ProfileStack}
    />
    <Stack.Screen
      options={{ headerShown: true }}
      name="Thread"
      component={ForumScreen}
      options={({ route }) => ({
        title: 'Thread ' + route.params.thread.id,
      })}
    />
    <Stack.Screen
      options={{ headerShown: true }}
      name="Reply"
      component={ReplyScreen}
    />
  </Stack.Navigator>
)
