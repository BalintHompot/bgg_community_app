import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { getRatingColor } from '../shared/bgg/collection'
import styleconstants from '../shared/styles/styleconstants'

const Hexagon = ({ rating, large = false}) => {
  const width = large ? 50 : 40

  const color = getRatingColor(rating)
  return (
    <View
      style={{
        width,
        height: width - 16,
      }}
    >
      <View
        style={[
          {
            width,
            height: width - 16,
            backgroundColor: color,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <Text
          style={{
            color: 'white',
            fontSize: large ? 22 : 18,
            fontFamily: styleconstants.primaryFontBold,
          }}
        >
          {Math.round(rating * 10) / 10}
        </Text>
      </View>
      <View
        style={[
          stylesHex.hexagonBefore,
          {
            borderLeftWidth: width / 2,
            borderRightWidth: width / 2,
            borderBottomColor: color,
          },
        ]}
      />
      <View
        style={[
          stylesHex.hexagonAfter,
          {
            borderLeftWidth: width / 2,
            borderRightWidth: width / 2,
            borderTopColor: color,
          },
        ]}
      />
    </View>
  )
}
const stylesHex = StyleSheet.create({
  hexagonAfter: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopWidth: 10,
  },
  hexagonBefore: {
    position: 'absolute',
    top: -10,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomWidth: 10,
  },
})

export default Hexagon
