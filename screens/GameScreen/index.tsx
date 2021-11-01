import PropTypes from 'prop-types'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import HTMLView from 'react-native-htmlview'
import React, { useDispatch, useEffect, useGlobal } from 'reactn'
import Hexagon from '../../components/Hexagon'
import Spinner from '../../components/Spinner'
import { GameStats, Polls } from '../../shared/bgg/types'
import { navigationType, routeType } from '../../shared/propTypes'
import { getGameDetailsReducer } from '../../shared/store/reducers/game'
import styleConstants, {
  layoutAnimation
} from '../../shared/styles/styleconstants'
import AddToButton from './AddToButton'
import HeaderLinks from './HeaderLinks'
import ImageList from './ImageList'
import LogPlayButton from './LogPlayButton'
import styles from './styles'

const GameScreen = ({ navigation, route }) => {
  const { game } = route.params
  const { objectId } = game
  const [
    { details, itemStats, images, playCount, collectionDetails } = {
      details: null,
      images: null,
      itemStats: { item: { rankinfo: [] } } as GameStats,
      playCount: 0,
      collectionDetails: { collectionStatus: {} },
    },
  ] = useGlobal(`game/${objectId}`)

  // console.log(JSON.stringify(useGlobal(`game/${objectId}`), null,2))

  // console.log('GameScreen/index.js', collectionDetails)

  const getGameDetails = useDispatch(getGameDetailsReducer)

  useEffect(() => {
    layoutAnimation()
    if (details === null) getGameDetails(objectId)
  }, [game])

  const _renderHeaderName = () => {
    const {
      item: {
        stats: stats = { average: '0', usersrated: '0', numcomments: '0' },
      },
    } = itemStats

    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.headerIconContainer}>
          <Hexagon rating={stats.average} large={true} />
        </View>

        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
          <Text
            style={{
              width: '100%',
              fontSize: 18,
              fontFamily: styleConstants.primaryFontBold,
              color: '#fff',
            }}
          >
            {game.name}
            {details ? (
              <Text style={{ color: '#dee0e2' }}>
                {' '}
                ({details.yearpublished})
              </Text>
            ) : null}
          </Text>
          {details ? (
            <Text
              style={{
                width: '100%',
                fontSize: 14,
                paddingTop: 2,
                paddingBottom: 8,
                fontFamily: styleConstants.primaryFont,
                color: '#fff',
              }}
            >
              {details.short_description}
            </Text>
          ) : null}
          <Text
            style={{
              width: '100%',
              fontSize: 14,
              paddingTop: 2,
              fontFamily: styleConstants.primaryFontBold,
              color: '#fff',
            }}
          >
            {abbreviateCount(stats.usersrated)} Ratings &{' '}
            {abbreviateCount(stats.numcomments)} Comments
          </Text>
        </View>
      </View>
    )
  }

  const abbreviateCount = (num: string) => {
    const parsedNum = parseInt(num)
    if (parsedNum > 999) {
      return _trimTo(parsedNum / 1000, 1)
    } else {
      return num
    }
  }

  const _trimTo = (decimal, places) =>
    (Math.round(decimal * 10) / 10).toFixed(places)

  type MinMax = {
    min: number
    max: number
  }

  const _playerCounts = (cnts: MinMax) => {
    if (!cnts) return '--'
    const playSpread = [cnts.min, cnts.max]

    if (playSpread[0] == playSpread[1]) {
      return playSpread[0]
    } else {
      return `${playSpread[0]}-${playSpread[1]}`
    }
  }

  const _renderUserPlayerVotes = (polls: Polls) => {
    if (polls.userplayers.totalvotes === '0') {
      return <Text style={styles.statsText}>(no votes)</Text>
    } else {
      return (
        <Text style={styles.statsText}>
          Community: {_playerCounts(polls.userplayers.recommended[0])} -- Best:{' '}
          {_playerCounts(polls.userplayers.best[0])}
        </Text>
      )
    }
  }

  const _renderGameStats = (details) => {
    const {
      item: { polls },
    } = itemStats

    if (polls !== undefined && details !== null) {
      return (
        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
          <View style={[styles.statsBox, styles.statsBoxRight]}>
            <Text style={styles.statsTitle}>
              {details.minplayers}-{details.maxplayers} Players
            </Text>
            {_renderUserPlayerVotes(polls)}
          </View>
          <View style={styles.statsBox}>
            <Text style={styles.statsTitle}>
              {_playerCounts({
                min: details.minplaytime,
                max: details.maxplaytime,
              })}{' '}
              Min
            </Text>
            <Text style={styles.statsText}>Playing Time</Text>
          </View>
          <View
            style={[styles.statsBox, styles.statsBoxRight, styles.statsBoxTop]}
          >
            <Text style={styles.statsTitle}>Age: {details.minage}+</Text>
            <Text style={styles.statsText}>Community: {polls.playerage}</Text>
          </View>
          <View style={[styles.statsBox, styles.statsBoxTop]}>
            <Text style={styles.statsTitle}>
              Weigth: {_trimTo(polls.boardgameweight.averageweight, 2)} / 5
            </Text>
            <Text style={styles.statsText}>Complexity Rating</Text>
          </View>
        </View>
      )
    }
  }

  const _renderCreditLine = (name, list, show) => {
    if (list.length > 0) {
      let to_show = list.slice(0, show)
      return (
        <View style={{ paddingBottom: 4 }}>
          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
            <Text style={styles.creditText}>
              <Text style={styles.creditTitle}>{name}: </Text>
              {to_show.map((item) => item.name).join(', ')}
              {list.length > show ? ` + ${list.length - show} more` : ''}
            </Text>
          </View>
        </View>
      )
    }
  }

  const _renderCredits = (details) => {
    if (details !== null) {
      return (
        <View>
          {_renderCreditLine('Alternative Names', details.alternatenames, 1)}
          {_renderCreditLine('Designer', details.links.boardgamedesigner, 2)}
          {_renderCreditLine('Artist', details.links.boardgameartist, 2)}
          {_renderCreditLine('Publisher', details.links.boardgamepublisher, 2)}
        </View>
      )
    }
  }

  const _renderDescription = (details) => {
    if (details !== null) {
      const description = details.description.replace(/\n/g, '')
      return (
        <View>
          <View style={styles.descriptionHeader}>
            <Text style={styles.descriptionHeaderText}>Description</Text>
          </View>
          <HTMLView
            style={{ width: '100%' }}
            stylesheet={htmlStyles}
            paragraphBreak={null}
            addLineBreaks={false}
            value={description}
          />
        </View>
      )
    }
  }

  const _renderMainImage = (images) => {
    if (images.previewthumb) {
      return (
        <Image
          source={{ uri: images.previewthumb }}
          resizeMode="contain"
          style={styles.headerImage}
        />
      )
    } else {
      return (
        <Spinner>
          <Text>Loading</Text>
        </Spinner>
      )
    }
  }

  const coverImages = details ? details.images : {}

  return (
    <ScrollView>
      <View style={styles.itemContainer}>
        <View style={styles.gameHeader}>{_renderMainImage(coverImages)}</View>
        <HeaderLinks
          navigation={navigation}
          details={details}
          itemStats={itemStats}
        />
        <View style={{ padding: 10, backgroundColor: '#000000' }}>
          {_renderHeaderName()}
        </View>
        <View style={{ padding: 10, backgroundColor: '#E7ECF1' }}>
          {_renderGameStats(details)}
          {_renderCredits(details)}
        </View>
        <View style={styles.headerBottonRow}>
          <AddToButton
            navigation={navigation}
            game={game}
            collectionDetails={collectionDetails}
          />
          <LogPlayButton
            navigation={navigation}
            game={game}
            playCount={playCount}
          />
        </View>
        <View style={{ padding: 10, backgroundColor: '#ffffff' }}>
          <ImageList images={images} />
          {_renderDescription(details)}
        </View>
      </View>
    </ScrollView>
  )
}

export default GameScreen

GameScreen.propTypes = {
  ...navigationType,
  ...routeType({
    game: PropTypes.shape({
      name: PropTypes.string,
      objectId: PropTypes.string.isRequired,
    }).isRequired,
    collectionId: PropTypes.string,
    collectionStatus: PropTypes.any,
    wishlistPriority: PropTypes.number,
  }),
}

const htmlStyles = StyleSheet.create({
  p: {
    marginTop: 0,
    marginBottom: 8,
    paddingTop: 0,
    paddingBottom: 0,
  },
})
