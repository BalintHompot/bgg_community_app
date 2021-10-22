import { EMPTY_GAME_COLLECTION_STATUS } from '../constants'
import { fetchJSON } from '../HTTP'
import { CollectionDetails, GameCollectionStatus } from '../store/types'
import { GameDetails, GameStats, Image } from './types'

const baseURL = 'https://api.geekdo.com/api'

export const fetchGameDetails = async (
  objectId: string
): Promise<GameDetails> => {
  const url = `${baseURL}/geekitems?objectid=${objectId}&showcount=10&nosession=1&ajax=1&objecttype=thing`

  const { item } = await fetchJSON(url)

  return item
}

export const fetchGameStats = async (objectId: string): Promise<GameStats> => {
  const url = `${baseURL}/dynamicinfo?objectid=${objectId}&showcount=10&nosession=1&ajax=1&objecttype=thing`
  return fetchJSON(url)
}

export const fetchGameImages = async (objectId: string): Promise<Image[]> => {
  const url = `${baseURL}/images?objectid=${objectId}&ajax=1&galleries%5B%5D=game&galleries%5B%5D=creative&nosession=1&objecttype=thing&showcount=17&size=crop100&sort=hot`
  let { images } = await fetchJSON(url)
  return images.map((img) => ({ id: img.imageid, url: img.imageurl_lg }))
}

export const fetchPlayCount = async (objectId: string) => {
  const path = `/geekplay.php?action=getuserplaycount&ajax=1&objectid=${objectId}&objecttype=thing`

  const { count } = await fetchJSON(path)
  return parseInt(count) || 0
}

export const fetchCollectionStatus = async (
  userId: string,
  objectId: string
): Promise<CollectionDetails> => {
  const url = `/api/collections?objectid=${objectId}&objecttype=thing&userid=${userId}`
  const { items } = await fetchJSON(url)

  let collid: string
  let wishlistpriority: number
  let status: GameCollectionStatus

  if (items.length > 0) {
    ;[{ collid, status, wishlistpriority }] = items
  } else {
    status = EMPTY_GAME_COLLECTION_STATUS
  }

  return {
    collectionId: collid,
    collectionStatus: status,
    wishlistPriority: wishlistpriority,
  }
}
