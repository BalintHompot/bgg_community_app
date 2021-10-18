import React from 'reactn'
import { Button } from 'react-native-elements'
import PropTypes from 'prop-types'
import Octicon from 'react-native-vector-icons/Octicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import styles from './styles'

const AddToButton = ({ navigation: { navigate }, game, collectionDetails }) => {
  const { collectionId, collectionStatus, wishlistPriority } = collectionDetails

  const inCollection = Object.keys(collectionStatus).length > 0

  const icon = inCollection ? (
    <Octicon name="check" color="green" size={18} />
  ) : (
    <FontAwesome name="list" color="#000" size={16} />
  )

  return (
    <Button
      buttonStyle={styles.headerButton}
      titleStyle={styles.headerButtonText}
      containerStyle={{
        ...styles.headerButtonContainer,
      }}
      icon={icon}
      onPress={() =>
        navigate('AddTo', {
          game,
          collectionId,
          collectionStatus,
          wishlistPriority,
        })
      }
      title={inCollection ? ' In Collection' : ' Add To ...'}
    />
  )
}

AddToButton.propTypes = {
  game: PropTypes.object.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  collectionDetails: PropTypes.shape({
    collectionId: PropTypes.string,
    collectionStatus: PropTypes.object,
    wishlistPriority: PropTypes.any,
  }),
}

export default AddToButton
