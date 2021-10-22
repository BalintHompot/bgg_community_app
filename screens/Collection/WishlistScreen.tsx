import { Text, View } from 'react-native'
import { Button, Icon } from 'react-native-elements'
import React, { useDispatch, useGlobal, useState } from 'reactn'
import GameList from '../../components/GameList'
import { navigationType, routeType } from '../../shared/propTypes'
import { fetchCollectionReducer } from '../../shared/store/reducers/collection'
import globalStyles from '../../shared/styles'

// class WishlistListScreen extends React.PureComponent {
//   static navigationOptions = ({ navigation }) => {
//     return {
//       title: 'My Wishlist',
//       headerRight: (
//         <Icon
//           name="add-to-list"
//           iconStyle={{ marginRight: 10 }}
//           type="entypo"
//           onPress={() => navigation.navigate('Search')}
//         />
//       ),
//     }
//   }

const WishlistListScreen = (props) => {
  const navigation = props.navigation
  const [refreshing, setRefreshing] = useState(false)
  const [collectionFetchedAt] = useGlobal('collectionFetchedAt')
  const fetchCollection = useDispatch(fetchCollectionReducer)
  const [collection] = useGlobal('collection')

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

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchCollection()
    setRefreshing(false)
  }

  if (collectionFetchedAt > 0) {
    const games = collection.filter(
      ({ collectionDetails }) => collectionDetails.collectionStatus.wishlist
    )

    return (
      <GameList
        navigation={navigation}
        listName="wishlist"
        games={games}
        refreshing={refreshing}
        onRefresh={handleRefresh}
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

WishlistListScreen.propTypes = {
  ...routeType({}),
  ...navigationType,
}

export default WishlistListScreen
