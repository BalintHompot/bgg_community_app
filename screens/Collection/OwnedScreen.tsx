import { Text, View } from 'react-native'
import { Button, Icon } from 'react-native-elements'
import React, { useDispatch, useEffect, useGlobal, useState } from 'reactn'
import GameList from '../../components/GameList'
import { logger } from '../../shared/debug'
import { navigationType, routeType } from '../../shared/propTypes'
import { fetchCollectionReducer } from '../../shared/store/reducers/collection'
import globalStyles from '../../shared/styles'

const OwnedListScreen = (props) => {
  const navigation = props.navigation

  const [refreshing, setRefreshing] = useState(false)

  const [collectionFetchedAt] = useGlobal('collectionFetchedAt')
  const [loggedIn] = useGlobal('loggedIn')
  const [collection] = useGlobal('collection')

  const fetchCollection = useDispatch(fetchCollectionReducer)

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          icon={<Icon name="add-to-list" type="entypo" size={20} />}
          onPress={() => navigation.navigate('Search')}
          buttonStyle={globalStyles.headerIconButton}
        />
      ),
    })
  }, [navigation])

  useEffect(() => {
    // check if we need to update the users collection

    const aWeekAgo = new Date().getTime() - 1000 * 60 * 60 * 24 * 7

    if (loggedIn && collectionFetchedAt < aWeekAgo) {
      handleRefresh()
    } else {
      logger(
        'Not logged in, or collection fetched less a week ago, so skipping fetch.'
      )
    }
  })

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchCollection()
    setRefreshing(false)
  }

  if (collectionFetchedAt > 0) {
    const games = collection.filter(
      (game) => game.collectionDetails.collectionStatus.own
    )

    return (
      <GameList
        navigation={navigation}
        listName="collection"
        games={games}
        refreshing={refreshing}
        onRefresh={fetchCollection}
      />
    )
  } else {
    return (
      <View style={globalStyles.emptyView}>
        <Text>Loading your collection...</Text>
      </View>
    )
  }
}

OwnedListScreen.propTypes = {
  ...routeType({}),
  ...navigationType,
}

export default OwnedListScreen
