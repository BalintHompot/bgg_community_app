// status on game objects returned from collection / wishlist
export interface GameStatus {
  fortrade: string
  lastmodified: Date
  own: string
  preordered: string
  prevowned: string
  want: string
  wanttobuy: string
  wanttoplay: string
  wishlist: string
}

// summary structure we use for collection items (comes as xml from BGG)
export interface CollectionItem {
  objectId: string
  name: string
  subtitle: string
  yearpublished: string
  image: string
  thumbnail: string
  collId?: string
  status: GameStatus
}
