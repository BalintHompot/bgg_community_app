import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { useEffect } from 'reactn'
import { ForumItem, Thread, ThreadList } from '../../shared/bgg/types/threads'
import { fetchJSON } from '../../shared/HTTP'
import {
  bottomBorderOnAllButLastItem,
  contentBlockStyles,
  listItemStyles
} from '../../shared/styles/contentStyles'
import placeHolderStyles from '../../shared/styles/placeHolderStyles'
import { layoutAnimation } from '../../shared/styles/styleconstants'

const ThreadsSummary = () => {
  const abortCon = new AbortController()
  const navigation = useNavigation()

  const [threads, setThreads] = useState({ data: [] } as ThreadList)

  useEffect(() => {
    layoutAnimation()
    if (threads.data.length === 0) fetchThreads()

    return () => abortCon.abort()
  }, [])

  const fetchThreads = async () => {
    let threads: ThreadList = await fetchJSON(
      '/api/threads?partial=listing&selection=homeforums&perPage=5&domain=boardgame',
      { signal: abortCon.signal }
    )

    setThreads(threads)
  }

  const navigateToThread = (thread: Thread) =>
    navigation.navigate('ModalWeb', { url: thread.href })

  const navigateToForum = (forum: ForumItem) =>
    navigation.navigate('Forum', { forumId: forum.id, forumName: forum.name })

  const renderItems = () => {
    const thumbStyle = {
      width: 80,
      height: 80,
      borderRadius: 5,
      marginRight: 10,
    }
    if (threads.data.length === 0) {
      const placeHolderItems = [1, 2, 3, 4, 5]
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
    return threads.data.map((thread, i) => {
      const thumbnail = thread.imageSets ? (
        <Image
          resizeMode="contain"
          source={{ uri: thread.imageSets.square.src }}
          style={thumbStyle}
        />
      ) : (
        <View
          style={{
            ...placeHolderStyles.base,
            ...thumbStyle,
            backgroundColor: '#ddd',
          }}
        />
      )

      return (
        <TouchableOpacity
          onPress={() => navigateToThread(thread)}
          key={thread.id}
          style={bottomBorderOnAllButLastItem(i, threads.data)}
        >
          {thumbnail}

          <View style={{ flex: 1, flexWrap: 'wrap' }}>
            <Text style={listItemStyles.titleText}>{thread.name}</Text>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}
            >
              <Text style={listItemStyles.subTitleText}>
                {thread.creator.username || ''} -
              </Text>
              <TouchableOpacity
                onPress={() => navigateToForum(thread.parent)}
                key={thread.id}
              >
                <Text style={listItemStyles.subTitleLink}>
                  {thread.parent.name}
                </Text>
              </TouchableOpacity>

              <Icon
                name="thumbs-up"
                color="#999"
                type="font-awesome"
                containerStyle={listItemStyles.subTitleIcon}
                size={14}
              />

              <Text style={listItemStyles.subTitleText}>
                {thread.numthumbs}
              </Text>
              <Icon
                name="comments"
                color="#999"
                type="font-awesome"
                containerStyle={listItemStyles.subTitleIcon}
                size={14}
              />

              <Text style={listItemStyles.subTitleText}>
                {thread.numreplies}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )
    })
  }

  if (threads.data.length === 0) return null
  return (
    <View style={contentBlockStyles.container}>
      <Text style={contentBlockStyles.headingText}>HOT DISCUSSIONS</Text>
      {renderItems()}
    </View>
  )
}

export default ThreadsSummary
