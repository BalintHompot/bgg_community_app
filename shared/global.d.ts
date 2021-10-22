import 'reactn'
import { CollectionItem } from './bgg/types'
import { BGGCredentials, GameCache } from './store/types'

const reducerDefaults = { global: State, dispatch: Dispatch }

declare module 'reactn/default' {
  export interface Reducers {
    getGameDetails: (...reducerDefaults, objectId: string) => GameCache
    setCredentials: (
      ...reducerDefaults,
      bggCredentials: BGGCredentials
    ) => Pick<State, 'loggedIn', 'bggCredentials'>
    fetchCollection: (
      ...reducerDefaults,
      bggCredentials: BGGCredentials
    ) => Pick<State, 'loggedIn', 'bggCredentials'>
    getNumUnreadReducer: (
      ...reducerDefaults
    ) => Pick<State, 'loggedIn', 'bggCredentials'>
  }

  export interface State {
    loggedIn: boolean
    bggCredentials?: BGGCredentials
    collection: CollectionItem[]
    collectionFetchedAt: number
    numUnread: number
    [key: string]: GameCache
  }
}
