import React, { useDispatch } from 'reactn'
import { View, Text } from 'react-native'
import { CheckBox, Button } from 'react-native-elements'

import { Picker } from '@react-native-picker/picker'
import PropTypes from 'prop-types'

import { navigationType, routeType } from '../../shared/propTypes.js'
import globalStyles from '../../shared/styles'
import styles from './styles'

const GameAddTo = ({ navigation, route }) => {
  const [collectionStatus, setCollectionStatusState] = React.useState(
    route.params.collectionStatus
  )
  const [wishlistPriority, setWishlistPriority] = React.useState(
    route.params.wishlistPriority
  )

  const setCollectionStatus = useDispatch('setCollectionStatus')

  const save = async () => {
    const { game, collectionId } = route.params
    setCollectionStatus(game, collectionId, collectionStatus, wishlistPriority)

    navigation.goBack(null)
  }

  const headerRight = () => (
    <Button
      small
      onPress={save}
      title="Save"
      buttonStyle={globalStyles.headerButton}
    />
  )
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerRight })
  }, [navigation, save])

  const collectionStates = [
    ['Owned', 'own'],
    ['Prevously Owned', 'prevowned'],
    ['For Trade', 'fortrade'],
    ['Want to Play', 'wanttoplay'],
    ['Want to Buy', 'wanttobuy'],
    ['Pre-ordered', 'preordered'],
    ['Wishlist', 'wishlist'],
  ]

  const wishlistValues = [
    { label: 'Must have', value: 1 },
    { label: 'Love to have', value: 2 },
    { label: 'Like to have', value: 3 },
    { label: 'Thinking about it', value: 4 },
    { label: "Don't buy this", value: 5 },
  ]

  const toggle = (attr) => {
    let currentState = collectionStatus[attr]
    setCollectionStatusState({ ...collectionStatus, [attr]: !currentState })
  }

  const _renderWishlistDropdown = (wishedFor) => {
    return wishedFor ? (
      <View style={styles.wishlistDropDownWrapper}>
        <Picker
          selectedValue={wishlistPriority}
          onValueChange={setWishlistPriority}
        >
          {wishlistValues.map(({ label, value }) => {
            return <Picker.Item key={value} label={label} value={value} />
          })}
        </Picker>
      </View>
    ) : null
  }

  const { name } = route.params.game

  let statusCheckBoxes = collectionStates.map((status, i) => (
    <CheckBox
      containerStyle={styles.checkboxContainer}
      title={status[0]}
      key={i}
      checked={collectionStatus[status[1]]}
      onPress={() => {
        toggle(status[1])
      }}
    />
  ))

  return (
    <View style={styles.main}>
      <Text style={styles.gameName}>{name}</Text>

      {statusCheckBoxes}

      {_renderWishlistDropdown(collectionStatus.wishlist)}
    </View>
  )
}

GameAddTo.propTypes = {
  ...navigationType,
  ...routeType({
    game: PropTypes.object.isRequired,
    collectionId: PropTypes.string,
    collectionStatus: PropTypes.any,
    wishlistPriority: PropTypes.number,
  }),
}

export default GameAddTo
