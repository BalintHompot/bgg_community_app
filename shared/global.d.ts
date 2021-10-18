import 'reactn'
import { BGGCredentials, GameCache } from './store/types'

declare module 'reactn/default' {
  export interface Reducers {
    // getGameDetails: (global: State, dispatch: Dispatch, objectId: string) => any
    setCredentials: (
      global: State,
      dispatch: Dispatch,
      bggCredentials: BGGCredentials
    ) => Pick<State, 'loggedIn', 'bggCredentials'>
  }

  export interface State {
    loggedIn: boolean
    [key: string]: GameCache
  }
}
