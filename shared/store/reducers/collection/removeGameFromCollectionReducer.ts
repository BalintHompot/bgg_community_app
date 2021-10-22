import { STORAGE_KEYS } from '../../../constants'
import { persistGlobal } from '../../helpers/persistence'

export const removeGameFromCollectionReducer = async (
  state,
  _,
  objectId: string
) => {
  const { collection } = state
  let idx = collection.findIndex((collectionGame) => {
    return collectionGame.objectId.toString() === objectId
  })

  if (idx > -1) {
    // exists
    collection.splice(idx, 1)
  }

  persistGlobal(STORAGE_KEYS.collection, { collection })

  return { collection }
}
