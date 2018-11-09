import React from 'reactn'
import PropTypes from 'prop-types'
import { createStackNavigator } from 'react-navigation'
import { Icon } from 'react-native-elements'

import GameScreen from './GameScreen'
import GameSearch from './GameSearch'
import GameAddTo from './GameAddTo'
import GameList from './../components/GameList'

class WishlistListScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Wishlist',
      headerRight: (
        <Icon
          name="add-to-list"
          iconStyle={{ marginRight: 10 }}
          type="entypo"
          onPress={() => navigation.navigate('Search')}
        />
      )
    }
  }

  handleRefresh = async () => {
    this.setState({ refreshing: true })
    this.global.fetchCollection()
    this.setState({ refreshing: false })
  }

  render = () => {
    const { navigate } = this.props.navigation
    const games = this.global.collection.filter(
      game => game.status.wishlist === '1'
    )

    return (
      <GameList
        navigation={{ navigate }}
        refreshing={false}
        games={games}
        onRefresh={this.global.fetchCollection}
      />
    )
  }
}

WishlistListScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
}

export default createStackNavigator({
  List: { screen: WishlistListScreen },
  Game: { screen: GameScreen },
  Search: { screen: GameSearch },
  AddTo: { screen: GameAddTo }
})
