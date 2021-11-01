import { useNavigation } from '@react-navigation/core'
import { Text, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements'
import React from 'reactn'
import { Forum } from '../../shared/bgg/types'
import { listItemStyles } from '../../shared/styles/contentStyles'

type ForumItemProps = {
  forum: Forum
}
const ForumItem = ({ forum }: ForumItemProps) => {
  const navigation = useNavigation()

  const navigateToForum = (forum: any) =>
    navigation.push('Forum', { forumId: forum.id, forumName: forum.name })


  return (
    <TouchableOpacity
      onPress={() => navigateToForum(forum)}
      key={forum.id}
      style={{
        ...listItemStyles.container,
        flexDirection: 'column',
        paddingVertical: 4,
        borderBottomColor: 'gainsboro',
        borderBottomWidth: 1,
        padding: 4,
      }}
    >
      <Text style={listItemStyles.titleText}>{forum.name}</Text>
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

        <Text style={listItemStyles.subTitleText}>{0} / </Text>
        <Icon
          name="comments"
          color="#999"
          type="font-awesome"
          containerStyle={listItemStyles.subTitleIcon}
          size={14}
        />

        <Text style={listItemStyles.subTitleText}>{0}</Text>
      </View>
      <View
        style={{
          flex: 1,
          // backgroundColor: 'blue',
          flexDirection: 'row',
        }}
      >
        <Text style={listItemStyles.subTitleTextStrong}>
          {forum.description}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default ForumItem
