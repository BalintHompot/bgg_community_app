import {
  FlatList,
  Image, StyleSheet, Text, TouchableOpacity, View
} from 'react-native'
import { showMessage } from 'react-native-flash-message'
import React, { useEffect, useState } from 'reactn'
import * as Sentry from 'sentry-expo'
import { getRatingColor } from '../../../shared/bgg/collection'
import styleconstants, {
  layoutAnimation
} from '../../../shared/styles/styleconstants'

const Hexagon = (props) => {
  return (
    <View style={stylesHex.hexagon}>
      <View
        style={[
          stylesHex.hexagonInner,
          {
            backgroundColor: props.color,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <Text
          style={{ color: 'white', fontFamily: styleconstants.primaryFontBold }}
        >
          {Math.round(props.rating * 10) / 10}
        </Text>
      </View>
      <View
        style={[stylesHex.hexagonBefore, { borderBottomColor: props.color }]}
      />
      <View style={[stylesHex.hexagonAfter, { borderTopColor: props.color }]} />
    </View>
  )
}
const stylesHex = StyleSheet.create({
  hexagon: {
    width: 40,
    height: 22,
  },
  hexagonInner: {
    width: 40,
    height: 22,
  },
  hexagonAfter: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 20,
    borderLeftColor: 'transparent',
    borderRightWidth: 20,
    borderRightColor: 'transparent',
    borderTopWidth: 10,
  },
  hexagonBefore: {
    position: 'absolute',
    top: -10,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 20,
    borderLeftColor: 'transparent',
    borderRightWidth: 20,
    borderRightColor: 'transparent',
    borderBottomWidth: 10,
  },
})

const HomeList = (props) => {
  const navigation = props.navigation

  const [refreshing, setRefreshing] = useState(false)
  const [homeList, setHomeList] = useState([])
  let [title, setTitle] = useState('Loading list')
  let [subTitle, setSubTitle] = useState('...')

  const showFlash = (message, type = 'danger') => {
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
          <Hexagon
            color={getRatingColor(props.item.rating)}
            rating={props.item.rating}
          />
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
            keyExtractor={({item})=>item.id}
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
