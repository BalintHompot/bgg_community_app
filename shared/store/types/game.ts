import { GameDetails, GameStats, Image } from '../../bgg/types'

export interface GameCacheCollection {
  [key: string]: GameCache
}

export interface GameCache {
  details: null | GameDetails
  objectId: string
  collectionDetails: CollectionDetails
  itemStats: GameStats
  images: Image[]
  playCount: number
}

export interface CollectionDetails {
  collectionId: string
  collectionStatus: GameCollectionStatus
  wishlistPriority: number
}

export interface GameCollectionStatus {
  fortrade: boolean
  own: boolean
  preordered: boolean
  prevowned: boolean
  wanttobuy: boolean
  wanttoplay: boolean
  wishlist: boolean
}
