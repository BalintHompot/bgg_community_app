import initialState from '../helpers/initialState'
import { persistGlobal } from '../helpers/persistence'

import AsyncStorage from '@react-native-community/async-storage'
import { BGGCredentials } from '../types'

const accountKey = 'account'

export const setCredentialsReducer = (
  _state: any,
  _dispatch: any,
  bggCredentials: BGGCredentials
) => {
  const loggedIn = Object.keys(bggCredentials).length > 0

  persistGlobal(accountKey, { loggedIn, bggCredentials })

  return { loggedIn, bggCredentials }
}

export const logOutReducer = async () => {
  await AsyncStorage.clear()
  global.cookie = null
  return initialState
}
