import React from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-elements'
import styles from './styles'
import { navigationType } from '../../shared/propTypes'

const LogPlayButton = ({ navigation: { navigate }, game, playCount }) => {
  const buttons = []

  const logPlayButtonStyle =
    playCount === 0
      ? {}
      : {
          width: 80,
          marginRight: 0,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }

  buttons.push(
    <Button
      key="logButton"
      buttonStyle={styles.headerButton}
      titleStyle={styles.headerButtonText}
      containerStyle={{
        ...styles.headerButtonContainer,
        ...logPlayButtonStyle,
      }}
      title="Log Play"
      onPress={() =>
        navigate('LogPlay', {
          game,
        })
      }
    />
  )

  if (playCount > 0) {
    buttons.push(
      <Button
        key="playsButton"
        buttonStyle={styles.headerButton}
        titleStyle={styles.headerButtonText}
        containerStyle={{
          ...styles.headerButtonContainer,
          width: 40,
          borderLeftColor: 'black',
          borderLeftWidth: 1,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        }}
        title={playCount > 999 ? '1k+' : playCount.toString()}
        onPress={() =>
          navigate('ListPlays', {
            game,
          })
        }
      />
    )
  }

  return <View style={styles.headerButtonGroup}>{buttons}</View>
}

LogPlayButton.propTypes = {
  ...navigationType,
}

export default LogPlayButton
