import { Picker } from '@react-native-picker/picker'
import PropTypes from 'prop-types'
import { Text, View } from 'react-native'
import { Button, CheckBox } from 'react-native-elements'
import React, { useDispatch } from 'reactn'
import { COLLECTION_STATES, WISHLIST_VALUES } from '../../shared/constants'
import { navigationType, routeType } from '../../shared/propTypes'
import { setCollectionStatusReducer } from '../../shared/store/reducers/collection'
import globalStyles from '../../shared/styles'
import styles from './styles'



const GameAddTo = ({ navigation, route }) => {
  const [collectionStatus, setCollectionStatusState] = React.useState(
    route.params.collectionStatus
  )
  const [wishlistPriority, setWishlistPriority] = React.useState(
    route.params.wishlistPriority
  )

  const setCollectionStatus = useDispatch(setCollectionStatusReducer)

  const save = async () => {
    const { game, collectionId } = route.params

    setCollectionStatus(game, collectionId, collectionStatus, wishlistPriority)

    navigation.goBack(null)
  }

  const headerRight = () => (
    <Button
      onPress={save}
      title="Save"
      buttonStyle={globalStyles.headerButton}
    />
  )
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerRight })
  }, [navigation, save])

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
          {WISHLIST_VALUES.map(({ label, value }) => {
            return <Picker.Item key={value} label={label} value={value} />
          })}
        </Picker>
      </View>
    ) : null
  }

  const { name } = route.params.game

  let statusCheckBoxes = COLLECTION_STATES.map((status, i) => (
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
