import {
  fetchGameDetails,
  fetchGameStats,
  fetchGameImages,
  fetchPlayCount,
  fetchCollectionStatus,
} from '../../../bgg/game'
import { showMessage } from 'react-native-flash-message'
import { fetchJSON } from '../../../HTTP'
import { GameCache } from '../../types/game'

export const getGameDetails = async (global, _dispatch, objectId: string) => {
  const [details, itemStats, images, playCount, collectionDetails] =
    await Promise.all([
      fetchGameDetails(objectId),
      fetchGameStats(objectId),
      fetchGameImages(objectId),
      fetchPlayCount(objectId),
      fetchCollectionStatus(global.bggCredentials.userid, objectId),
    ])

  const fetchedAt = new Date().getTime()

  return {
    [`game/${objectId}`]: {
      objectId,
      details,
      itemStats,
      images,
      playCount,
      collectionDetails,
      fetchedAt,
    },
  }
}

export const setPlayCount = async (global, _dispatch, objectId, playCount) => {
  const game = global[`game/${objectId}`]
  return {
    [`game/${objectId}`]: {
      ...game,
      playCount,
    },
  }
}

export const setCollectionStatus = async (
  global,
  dispatch,
  { objectId, name },
  collectionId,
  collectionStatus,
  wishlistPriority
) => {
  const body = {
    item: {
      collid: collectionId || 0,
      status: collectionStatus,
      objectid: objectId,
      objectname: name,
      objecttype: 'thing',
      acquisitiondate: null,
      invdate: null,
      wishlistpriority: wishlistPriority,
    },
  }

  let response, success
  if (collectionId) {
    const url = `/api/collectionitems/${collectionId}`
    response = await fetchJSON(url, { method: 'PUT', body })

    success = response.message === 'Item updated'
  } else {
    const url = '/api/collectionitems'
    response = await fetchJSON(url, { method: 'POST', body })
    success = response.message === 'Item saved'
  }

  if (success) {
    //update global / store
    const game: GameCache = global[`game/${objectId}`]

    if (Object.values(collectionStatus).some((state) => state)) {
      game.collectionDetails.collectionStatus = {}

      Object.keys(collectionStatus).map((key) => {
        game.collectionDetails.collectionStatus[key] = collectionStatus[key]
          ? '1'
          : '0'
      })

      dispatch.addOrUpdateGameInCollection(game)
    } else {
      game.collectionDetails.collectionStatus = {}
      dispatch.removeGameFromCollection(game)
    }

    return {
      [`game/${objectId}`]: {
        ...game,
      },
    }
  } else {
    showMessage({
      message: "Failed to save item's collection status, please try again.",
      icon: 'auto',
      type: 'danger',
    })
  }
}
