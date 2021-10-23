// initial state, expect nothing will come from async

import { State } from 'reactn/default'

export type PreviewFilterType = {
  name: string
  priorities: any[]
  halls: any[]
  seen: any[]
  availability: any[]
  preorders: any[]
  filterTextOn: string
  sortBy: string
}

export const previewFiltersDefault: PreviewFilterType = {
  name: '',
  priorities: [],
  halls: [],
  seen: [],
  availability: [],
  preorders: [],
  filterTextOn: 'game',
  sortBy: 'publisherGame',
}

const initialSate: State = {
  collection: [],
  collectionFetchedAt: 0,
  loggedIn: false,
  bggCredentials: {},
  numUnread: 0,

  // previews
  previewFetchedAt: 0,
  previewPurchases: {},
  previewPurchasesFetchedAt: 0,
  previewGames: [],
  previewCompanies: [],
  previewUserSelections: [],
  previewLoading: false,
  previewFilters: { ...previewFiltersDefault },
  previewFiltersDefault,
  previewFiltersSet: false,
}

export default initialSate
