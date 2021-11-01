import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import { MessageType, showMessage } from 'react-native-flash-message'
import React, { useEffect, useState } from 'reactn'
import { Native as Sentry } from 'sentry-expo'
import Hexagon from '../../../components/Hexagon'
import { fetchRaw } from '../../../shared/HTTP'
import styleconstants, {
  layoutAnimation
} from '../../../shared/styles/styleconstants'

const AllTimeList = (props) => {
  const navigation = props.navigation

  const [categoryListOpen, setCategoryListOpen] = useState(false)
  const [categoryListSelection, setCategoryListSelection] = useState(null)
  const [allTimeList, setallTimeList] = useState([])
  const [subTitle, setSubTitle] = useState('...')
  const [categories, setCategories] = useState([])

  const showFlash = (message, type: MessageType = 'danger') => {
    showMessage({ message, type, icon: 'auto' })
  }

  const fetchallTimeIDs = () => {
    fetchRaw('/api/subdomains?domain=boardgame')
      .then((ids) => {
        ids.json().then((idJson) => {
          //console.log("all time id-s", idJson)
          const cats = []
          for (const i in idJson) {
            cats.push(idJson[i])
            cats[i].label = cats[i].name
            cats[i].value = cats[i].id
          }
          setCategories(cats)
          var randInd = Math.floor(Math.random() * cats.length)
          setCategoryListSelection(cats[randInd].value)
        })
      })
      .catch((error) => {
        showFlash('There was a problem with loading the allTime list id-s.')
        Sentry.captureException(error)
      })
  }

  useEffect(() => {
    if (categoryListSelection === null) return

    const allTimeURL = '/api/subdomaingamelists/' + categoryListSelection

    fetchRaw(allTimeURL)
      .then((allTimeList) => {
        //console.log("all time list is", allTimeList.status)
        if (allTimeList.status === 200) {
          allTimeList.json().then((allTimeListJson) => {
            setallTimeList(allTimeListJson.games)
            setSubTitle(allTimeListJson.description)
          })
        } else {
          showFlash('There was a problem with loading the allTime list.')
          Sentry.captureMessage('Non 200 Response for HTTP request.', {
            extra: { url: allTimeURL, stauts: allTimeList.status },
          })
        }
      })
      .catch((error) => {
        showFlash('There was a problem with loading the allTime list.')
        Sentry.captureException(error)
      })
  }, [categoryListSelection])

  useEffect(() => {
    layoutAnimation()

    if (categories.length === 0) fetchallTimeIDs()
  }, [categories])

  const AllTimeItem = (props) => {
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
    <View
      style={{
        backgroundColor: 'white',
        marginVertical: 3,
        padding: 15,
        zIndex: 1,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', zIndex: 1 }}>
        <Text
          style={{ fontFamily: styleconstants.primaryFontBold, fontSize: 20 }}
        >
          {'Best games of all time in: '}
        </Text>

        <DropDownPicker
          listMode="SCROLLVIEW"
          placeholder={categoryListSelection?.name}
          containerStyle={{ width: 150, margin: 0, height: 30 }}
          style={{ margin: 0, height: 30 }}
          items={categories}
          open={categoryListOpen}
          setOpen={setCategoryListOpen}
          value={categoryListSelection}
          setValue={setCategoryListSelection}
        />
      </View>
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
        {allTimeList.length > 0 ? (
          <FlatList
            data={allTimeList}
            keyExtractor={({ item }) => item.id}
            renderItem={({ item, index }) => {
              return (
                <AllTimeItem
                  item={item}
                  index={index}
                  navigation={navigation}
                />
              )
            }}
            horizontal
          />
        ) : (
          <Text>Loading top games in categroy ...</Text>
        )}
      </View>
    </View>
  )
}

export default AllTimeList
