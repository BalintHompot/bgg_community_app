import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'reactn'
import { HeroItem, User } from '../../shared/bgg/types'
import { fetchJSON } from '../../shared/HTTP'
import {
  bottomBorderOnAllButLastItem,
  contentBlockStyles,
  listItemStyles
} from '../../shared/styles/contentStyles'
import placeHolderStyles from '../../shared/styles/placeHolderStyles'
import { layoutAnimation } from '../../shared/styles/styleconstants'

const Hero = () => {
  const abortCon = new AbortController()
  const navigation = useNavigation()

  const [heroItems, setHeroItems] = useState([] as HeroItem[])

  useEffect(() => {
    layoutAnimation()

    if (heroItems.length === 0) fetchHero()

    return () => abortCon.abort()
  }, [])

  const fetchHero = async () => {
    let heroItems: HeroItem[] = await fetchJSON('/api/homehero', {
      signal: abortCon.signal,
    })

    heroItems = await Promise.all(
      heroItems.map(async (item) => {
        item.resolvedAuthor = (await fetchJSON(`/api/users/${item.author}`, {
          signal: abortCon.signal,
        })) as User

        return item
      })
    )

    // console.log(JSON.stringify(homepageHero, null, 2))

    setHeroItems(heroItems)
  }

  const navigateToHeroItem = (item: HeroItem) => {
    navigation.navigate('ModalWeb', { url: item.href })
  }

  const renderPrimaryHero = () => {
    const hero = heroItems[0]

    if (!hero) {
      return (
        <View style={{ flexDirection: 'column' }}>
          <View
            style={{
              ...placeHolderStyles.base,
              width: '100%',
              height: 120,
              marginBottom: 3,
            }}
          />
          <View
            style={{
              ...placeHolderStyles.base,
              marginBottom: 3,
            }}
          />
        </View>
      )
    } else {
      return (
        <TouchableOpacity
          onPress={() => navigateToHeroItem(hero)}
          style={{
            backgroundColor: 'white',
            marginBottom: 3,
            borderBottomColor: 'gainsboro',
            borderBottomWidth: 1,
          }}
        >
          <View style={{ height: 150 }}>
            <Image
              resizeMode="cover"
              source={{ uri: hero.images.hero['src@2x'] }}
              style={{ width: '100%', height: '100%' }}
            />
          </View>
          <Text numberOfLines={2} style={listItemStyles.titleText}>
            {hero.title}
          </Text>
          <Text style={{ ...listItemStyles.subTitleText, marginVertical: 5 }}>
            by {hero.resolvedAuthor?.username || ''}
          </Text>
        </TouchableOpacity>
      )
    }
  }

  const renderItems = () => {
    const thumbStyle = {
      width: 80,
      height: 80,
      borderRadius: 5,
      marginRight: 10,
    }

    if (heroItems.length === 0) {
      // placeholder
      const placeHolderItems = [1, 2, 3, 4]
      return placeHolderItems.map((i) => (
        <View
          key={i}
          style={bottomBorderOnAllButLastItem(i + 1, placeHolderItems)}
        >
          <View
            style={{
              ...placeHolderStyles.base,
              ...thumbStyle,
            }}
          />
          <View style={{ flex: 1, flexWrap: 'wrap' }}>
            <View
              style={{
                ...placeHolderStyles.base,
                width: '90%',
                marginBottom: 10,
              }}
            />
            <View
              style={{
                ...placeHolderStyles.base,
              }}
            />
          </View>
        </View>
      ))
    }
    // content
    return heroItems.slice(1).map((item, i) => {
      return (
        <TouchableOpacity
          onPress={() => navigateToHeroItem(item)}
          key={item.href}
          style={bottomBorderOnAllButLastItem(i + 1, heroItems)}
        >
          <Image
            resizeMode="contain"
            source={{ uri: item.images.herosquare['src@2x'] }}
            style={thumbStyle}
          />

          <View style={{ flex: 1, flexWrap: 'wrap' }}>
            <Text style={listItemStyles.titleText}>{item.title}</Text>
            <Text style={listItemStyles.subTitleText}>
              by {item.resolvedAuthor?.username || ''}
            </Text>
          </View>
        </TouchableOpacity>
      )
    })
  }
  return (
    <View style={contentBlockStyles.container}>
      {renderPrimaryHero()}
      {renderItems()}
    </View>
  )
}

export default Hero
