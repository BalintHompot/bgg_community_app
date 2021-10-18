import { GameDetails } from '../../bgg/types'

export interface GameCacheCollection {
  [key: string]: GameCache
}

export interface GameCache {
  details: null | GameDetails
  objectId: string
  collectionDetails: {
    collectionId: string
    objectId: string
    wishlistPriority: number
    collectionStatus: GameCollectionStatus
  }
}

export interface GameCollectionStatus {
  fortrade?: '1' | '0'
  own?: '1' | '0'
  preordered?: '1' | '0'
  prevowned?: '1' | '0'
  wanttobuy?: '1' | '0'
  wanttoplay?: '1' | '0'
  wishlist?: '1' | '0'
}
