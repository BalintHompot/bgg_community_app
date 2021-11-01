import { useNavigation } from '@react-navigation/core'
import { formatDistance } from 'date-fns'
import { Text, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements'
import React from 'reactn'
import { Thread } from '../../shared/bgg/types'
import { listItemStyles } from '../../shared/styles/contentStyles'

type ThreadItemProps = {
  thread: Thread
}
const ThreadItem = ({ thread }: ThreadItemProps) => {
  const navigation = useNavigation()
  const navigateToThread = (thread: Thread) =>
    navigation.navigate('ModalWeb', { url: thread.href })

  return (
    <TouchableOpacity
      onPress={() => navigateToThread(thread)}
      key={thread.id}
      style={{
        ...listItemStyles.container,
        flexDirection: 'column',
        paddingVertical: 4,
        borderBottomColor: 'gainsboro',
        borderBottomWidth: 1,
        padding: 4,
      }}
    >
      <Text style={listItemStyles.titleText}>{thread.name}</Text>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
        }}
      >
        <Icon
          name="thumbs-up"
          color="#999"
          type="font-awesome"
          containerStyle={listItemStyles.subTitleIcon}
          size={14}
        />

        <Text style={listItemStyles.subTitleText}>{thread.numthumbs} / </Text>
        <Icon
          name="comments"
          color="#999"
          type="font-awesome"
          containerStyle={listItemStyles.subTitleIcon}
          size={14}
        />

        <Text style={listItemStyles.subTitleText}>{thread.numreplies}</Text>
      </View>
      <View
        style={{
          flex: 1,
          // backgroundColor: 'blue',
          flexDirection: 'row',
        }}
      >
        <Text style={listItemStyles.subTitleTextStrong}>
          {thread.creator?.name} | Active{' '}
          {formatDistance(new Date(thread.lastPost.postdate), new Date())} ago
        </Text>
      </View>
    </TouchableOpacity>
  )
}


export default ThreadItem