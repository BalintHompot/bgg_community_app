import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'reactn'
import Spinner from '../../components/Spinner'
import { Forum, ForumList, Thread, ThreadList } from '../../shared/bgg/types'
import { fetchJSON } from '../../shared/HTTP'
import styles from '../../shared/styles'
import { listItemStyles } from '../../shared/styles/contentStyles'
import styleConstants from '../../shared/styles/styleconstants'
import ForumItem from './ForumItem'
import ThreadItem from './ThreadItem'

type ThreadState = {
  [threadId: string]: Thread
}

const forumIdRegExp = new RegExp(/\/(\d*)\//)

const ForumScreen = ({ navigation, route }) => {
  const abortCon = new AbortController()
  const { forumId } = route.params
  const pageSize = 50
  const [forum, setForum] = useState({ postingPermitted: true } as Forum)
  const [subForums, setSubForums] = useState([] as Forum[])
  const [pages, setPages] = useState([1])
  const [threads, setThreads] = useState({} as ThreadState)

  // load the forum details
  useEffect(() => {
    fetchForum()
    return () => abortCon.abort()
  }, [])

  // load the threads (if posting is allowed)
  useEffect(() => {
    if (forum.postingPermitted) fetchForumThreads()

    return () => abortCon.abort()
  }, [pages])

  // load the subforums (if posting isn't allowed)
  useEffect(() => {
    if (!forum.postingPermitted) {
      fetchSubForums()
    }
    return () => abortCon.abort()
  }, [forum.postingPermitted])

  const fetchForum = async () => {
    const forum: Forum = await fetchJSON(`/api/uforums/${forumId}`, {
      signal: abortCon.signal,
    })
    setForum(forum)
  }

  const fetchSubForums = async () => {
    const subForums: ForumList = await fetchJSON(
      `/api/uforums?ancestorForumuid=${forumId}&partial=listing`,
      {
        signal: abortCon.signal,
      }
    )
    setSubForums(subForums.uforums)
  }

  const fetchForumThreads = async () => {
    const newThreads: ThreadList = await fetchJSON(
      `/api/threads?partial=listing&forumuid=${forumId}&pageid=${
        pages[pages.length - 1]
      }&sort=activepinned&perPage=${pageSize}`
    )

    const mergedThreads = {
      ...threads,
    }

    newThreads.data.forEach((t) => (mergedThreads[t.id] = t))

    setThreads(mergedThreads)
  }

  const navigateToForum = (forum: any) =>
    navigation.push('Forum', { forumId: forum.id, forumName: forum.name })

  const renderHeader = () => {
    const headerSubTitleStyle = {
      fontFamily: styleConstants.primaryFont,
      fontSize: 15,
      color: styleConstants.subtitleTextColor,
      textDecorationLine: 'underline',
    }
    if (forum.ancestorForums) {
      return (
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontFamily: styleConstants.primaryFontBold,
              fontSize: 20,
              marginBottom: 4,
            }}
          >
            {forum.name}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={headerSubTitleStyle}>Forums</Text>
            <Text>{forum.ancestorForums.length > 0 ? ' > ' : null}</Text>

            {forum.ancestorForums.map((forum) => {
              const [_, id] = forumIdRegExp.exec(forum.href)

              return (
                <TouchableOpacity
                  onPress={() => navigateToForum({ id, name: forum.name })}
                  key={id}
                >
                  <Text style={headerSubTitleStyle}>{forum.name}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      )
    } else {
      return (
        <View style={{ marginBottom: 20 }}>
          <View
            style={{
              width: '80%',
              height: 20,
              borderRadius: 2,
              marginBottom: 3,
              backgroundColor: styleConstants.placeholderBGColor,
            }}
          />
          <View
            style={{
              width: '60%',
              height: 15,
              borderRadius: 2,
              backgroundColor: styleConstants.placeholderBGColor,
            }}
          />
        </View>
      )
    }
  }

  const renderEmpty = () => {
    return (
      <Spinner>
        <Text style={listItemStyles.subTitleText}>Loading threads...</Text>
      </Spinner>
    )
  }
  const renderSubForums = () => {
    if (!forum.postingPermitted) {
      return (
        <FlatList
          data={subForums}
          keyExtractor={({ id }) => id}
          renderItem={({ item: forum }) => <ForumItem forum={forum} />}
          ListEmptyComponent={renderEmpty}
        ></FlatList>
      )
    }
  }

  const renderThreads = () => {
    if (forum.postingPermitted) {
      return (
        <FlatList
          data={Object.values(threads)}
          keyExtractor={({ id }) => id}
          renderItem={({ item: thread }) => <ThreadItem thread={thread} />}
          onEndReached={() => setPages([...pages, pages[pages.length - 1] + 1])}
          ListEmptyComponent={renderEmpty}
        ></FlatList>
      )
    }
  }

  return (
    <View style={styles.mainView}>
      {renderHeader()}
      {renderSubForums()}
      {renderThreads()}
    </View>
  )
}

export default ForumScreen
