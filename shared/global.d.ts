import 'reactn'
import { CollectionItem } from './bgg/types'
import { BGGCredentials, GameCache } from './store/types'

declare module 'reactn/default' {
  export interface Reducers {
    getGameDetails: (
      global: State,
      dispatch: Dispatch,
      objectId: string
    ) => GameCache
    setCredentials: (
      global: State,
      dispatch: Dispatch,
      bggCredentials: BGGCredentials
    ) => Pick<State, 'loggedIn', 'bggCredentials'>
    fetchCollection: (
      global: State,
      dispatch: Dispatch,
      bggCredentials: BGGCredentials
    ) => Pick<State, 'loggedIn', 'bggCredentials'>
  }

  export interface State {
    loggedIn: boolean
    bggCredentials?: BGGCredentials
    collection: CollectionItem[]
    collectionFetchedAt: number
    numUnread: number
    cookie?: string
    [key: string]: GameCache
  }
}
