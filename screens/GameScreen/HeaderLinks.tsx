import { Text, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements'
import React from 'reactn'
import styleConstants from '../../shared/styles/styleconstants'
import styles from './styles'

const HeaderLinks = ({ navigation, details, itemStats }) => {
  const {
    item: { rankinfo: rankInfo },
  } = itemStats

  const {
    links: { reimplements, reimplementation },
  } = details || { links: { reimplements: [], reimplementation: [] } }

  const renderRank =
    rankInfo && rankInfo.length > 0 && parseInt(rankInfo[0].rank) > 0 ? (
      <View style={{ flexDirection: 'row' }}>
        <Icon
          name="crown"
          type="foundation"
          color={styleConstants.bggorange}
          size={14}
          containerStyle={{
            marginRight: 4,
            height: 16,
          }}
        />
        <Text
          style={{
            ...styles.headerRatingsText,
          }}
        >
          RANK:{' '}
        </Text>
        {rankInfo.map((rank, i) => (
          <Text
            key={i}
            style={{
              ...styles.headerRatingsText,

              paddingRight: 8,
            }}
          >
            {rank.veryshortprettyname.toUpperCase().trim()}:{' '}
            {rank.rank.toUpperCase()}
          </Text>
        ))}
      </View>
    ) : null

  const renderReimplements =
    reimplements.length > 0 ? (
      <View style={{ flexDirection: 'row' }}>
        <Icon
          name="link"
          type="foundation"
          color={styleConstants.bggorange}
          size={14}
          containerStyle={{
            marginRight: 4,
            height: 16,
          }}
        />
        <Text
          style={{
            ...styles.headerRatingsText,
          }}
        >
          REIMPLEMENTS:{' '}
        </Text>
        {reimplements.map((reimplement, i) => (
          <TouchableOpacity
            onPress={() =>
              navigation.push('GameStack', {
                screen: 'Game',
                params: {
                  game: {
                    name: reimplement.name,
                    objectId: reimplement.objectid,
                  },
                },
              })
            }
            key={i}
          >
            <Text
              style={{
                ...styles.headerRatingsText,
                textDecorationLine: 'underline',
                paddingRight: 8,
              }}
            >
              {reimplement.name.toUpperCase()}{' '}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    ) : null

  const renderReimplementations =
    reimplementation.length > 0 ? (
      <View style={{ flexDirection: 'row' }}>
        <Icon
          name="link"
          type="foundation"
          color={styleConstants.bggorange}
          size={14}
          containerStyle={{
            marginRight: 4,
            height: 16,
          }}
        />
        <Text
          style={{
            ...styles.headerRatingsText,
          }}
        >
          REIMPLEMENTED BY:{' '}
        </Text>
        {reimplementation.map((reimplement, i) => (
          <TouchableOpacity
            onPress={() =>
              navigation.push('GameStack', {
                screen: 'Game',
                params: {
                  game: {
                    name: reimplement.name,
                    objectId: reimplement.objectid,
                  },
                },
              })
            }
            key={i}
          >
            <Text
              style={{
                ...styles.headerRatingsText,
                textDecorationLine: 'underline',
                paddingRight: 8,
              }}
            >
              {reimplement.name.toUpperCase()}{' '}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    ) : null

  if (renderRank || renderReimplements || renderReimplementations) {
    return (
      <View style={styles.headerRatings}>
        {renderRank}
        {renderReimplements}
        {renderReimplementations}
      </View>
    )
  } else {
    return null
  }
}


export default HeaderLinks