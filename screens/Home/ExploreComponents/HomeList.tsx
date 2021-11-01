import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { MessageType, showMessage } from 'react-native-flash-message'
import React, { useEffect, useState } from 'reactn'
import { Native as Sentry } from 'sentry-expo'
import Hexagon from '../../../components/Hexagon'
import styleconstants, {
  layoutAnimation
} from '../../../shared/styles/styleconstants'

const HomeList = (props) => {
  const navigation = props.navigation

  const [homeList, setHomeList] = useState([])
  let [title, setTitle] = useState('Loading list')
  let [subTitle, setSubTitle] = useState('...')

  const showFlash = (message, type: MessageType = 'danger') => {
    showMessage({ message, type, icon: 'auto' })
  }

  const fetchHomeList = () => {
    let homeURL = 'https://api.geekdo.com/api/homegamelists/' + props.listId
    fetch(homeURL)
      .then((homeList) => {
        //console.log("home list is", homeList.status)
        if (homeList.status === 200) {
          homeList.json().then((homeListJson) => {
            // console.log("home list json", homeListJson)
            setHomeList(homeListJson.games)
            setTitle(homeListJson.title)
            setSubTitle(homeListJson.description)
          })
        } else {
          showFlash('There was a problem with loading the home list.')
          Sentry.captureMessage('Non 200 Response for HTTP request.', {
            extra: { url: homeURL, stauts: homeList.status },
          })
        }
      })
      .catch((error) => {
        showFlash('There was a problem with loading the home list.')
        Sentry.captureException(error)
      })
  }

  useEffect(() => {
    layoutAnimation()

    if (homeList.length === 0) {
      fetchHomeList()
    }
  })

  const HomeItem = (props) => {
    return (
      <TouchableOpacity
        style={{ margin: 3, width: 150, padding: 10 }}
        onPress={() => {
          props.navigation.navigate('GameStack', {
            screen: 'Game',
            params: {
              game: {
                objectId: props.item.item.id,
                name: props.item.item.name,
              },
            },
          })
        }}
      >
        <Image
          resizeMode={'contain'}
          source={{ uri: props.item.item.imageSets.square100['src@2x'] }}
          style={{ width: 130, height: 130, borderRadius: 5 }}
        />
        <View style={{ position: 'absolute', top: 100, left: 12 }}>
          <Hexagon rating={props.item.rating} />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text
            style={{
              marginVertical: 4,
              fontFamily: styleconstants.primaryFontBold,
              color: 'grey',
            }}
          >
            {props.item.item.descriptors[0]
              ? props.item.item.descriptors[0].displayValue
              : '--'}
          </Text>
          <Text
            style={{
              marginVertical: 4,
              fontFamily: styleconstants.primaryFontBold,
              color: 'grey',
            }}
          >
            {props.item.item.descriptors[1]
              ? props.item.item.descriptors[1].displayValue
              : '--'}
          </Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Text
            numberOfLines={1}
            style={{
              marginVertical: 4,
              fontFamily: styleconstants.primaryFontBold,
            }}
          >
            {props.item.item.name}
          </Text>
        </View>
        <Text style={{ fontFamily: styleconstants.primaryFont }}>
          {props.item.description}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={{ backgroundColor: 'white', marginVertical: 3, padding: 15 }}>
      <Text
        style={{ fontFamily: styleconstants.primaryFontBold, fontSize: 20 }}
      >
        {title}
      </Text>
      <Text style={{ fontFamily: styleconstants.primaryFont, fontSize: 16 }}>
        {subTitle}
      </Text>

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 10,
        }}
      >
        {homeList.length > 0 ? (
          <FlatList
            data={homeList}
            keyExtractor={({ item }) => item.id}
            renderItem={({ item, index }) => {
              return (
                <HomeItem item={item} index={index} navigation={navigation} />
              )
            }}
            horizontal
          />
        ) : (
          <Text>Loading the home list...</Text>
        )}
      </View>
    </View>
  )
}

export default HomeList
