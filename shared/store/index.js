import { setGlobal, addReducers } from 'reactn'
import addReactNDevTools from 'reactn-devtools'

import initialState from './helpers/initialState'
import { getPersisted } from './helpers/persistence'

import * as previewReducers from './reducers/preview'

addReactNDevTools()
// preview
addReducers(previewReducers)

export const setupStore = async () => {
  // now we load the data from Async store
  const persistedAccount = await getPersisted('account')
  const persistedCollection = await getPersisted('collection')

  // update global store with stuff from async and initial
  await setGlobal({
    ...initialState,
    ...persistedAccount,
    ...persistedCollection,
  })
}
