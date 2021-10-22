import { State } from 'reactn/default'
import { CollectionItem } from '../../../bgg/types'
import { STORAGE_KEYS } from '../../../constants'
import { persistGlobal } from '../../helpers/persistence'

export const addOrUpdateGameInCollectionReducer = async (
  state: State,
  _,
  game: CollectionItem
) => {
  const { collection } = state

  let idx = collection.findIndex(
    (collectionGame) =>
      collectionGame.objectId.toString() === game.objectId.toString()
  )

  if (idx > -1) {
    // already exists
    collection[idx] = game
  } else {
    // new game to collection
    collection.push(game)
  }

  persistGlobal(STORAGE_KEYS.collection, { collection })

  return { collection }
}
