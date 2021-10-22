export const COLLECTION_STATES = [
  ['Owned', 'own'],
  ['Prevously Owned', 'prevowned'],
  ['For Trade', 'fortrade'],
  ['Want to Play', 'wanttoplay'],
  ['Want to Buy', 'wanttobuy'],
  ['Pre-ordered', 'preordered'],
  ['Wishlist', 'wishlist'],
]

export const WISHLIST_VALUES = [
  { label: 'Must have', value: 1 },
  { label: 'Love to have', value: 2 },
  { label: 'Like to have', value: 3 },
  { label: 'Thinking about it', value: 4 },
  { label: "Don't buy this", value: 5 },
]

export const EMPTY_GAME_COLLECTION_STATUS = {
  own: false,
  wishlist: false,
  wanttobuy: false,
  wanttoplay: false,
  fortrade: false,
  preordered: false,
  prevowned: false,
}

export const STORAGE_KEYS = {
  collection: 'collection',
}

export const DEFAULT_BGG_URL = 'https://bgg.cc'
