import {
  fetchCollectionStatus,
  fetchGameDetails,
  fetchGameImages,
  fetchGameStats,
  fetchPlayCount,
} from '../../../bgg/game'

export const getGameDetailsReducer = async (
  global,
  _dispatch,
  objectId: string
) => {
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

export const setPlayCountReducer = async (
  global,
  _dispatch,
  objectId,
  playCount
) => {
  const game = global[`game/${objectId}`]
  return {
    [`game/${objectId}`]: {
      ...game,
      playCount,
    },
  }
}
