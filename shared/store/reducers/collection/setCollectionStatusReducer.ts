import { showMessage } from 'react-native-flash-message'
import {
  addOrUpdateGameInCollectionReducer,
  removeGameFromCollectionReducer,
} from '.'
import { CollectionItem } from '../../../bgg/types'
import { EMPTY_GAME_COLLECTION_STATUS } from '../../../constants'
import { fetchJSON } from '../../../HTTP'
import { GameCache, GameCollectionStatus } from '../../types'

export const setCollectionStatusReducer = async (
  global,
  dispatch,
  { objectId, name },
  collectionId,
  collectionStatus: GameCollectionStatus,
  wishlistPriority: number
) => {
  const body = {
    item: {
      collid: collectionId || 0,
      status: collectionStatus,
      objectid: objectId,
      objectname: name,
      objecttype: 'thing',
      acquisitiondate: null,
      invdate: null,
      wishlistpriority: wishlistPriority,
    },
  }

  let response, success
  if (collectionId) {
    const url = `/api/collectionitems/${collectionId}`
    response = await fetchJSON(url, { method: 'PUT', body })

    success = response.message === 'Item updated'
  } else {
    const url = '/api/collectionitems'
    response = await fetchJSON(url, { method: 'POST', body })
    success = response.message === 'Item saved'
  }

  if (success) {
    //update global / store
    const game: GameCache = global[`game/${objectId}`]

    let collection: CollectionItem[]

    if (Object.values(collectionStatus).some((state) => state)) {
      // update the game's collectionStatus
      game.collectionDetails.collectionStatus = collectionStatus
      game.collectionDetails.wishlistPriority = wishlistPriority

      // add the game to the collection
      const collectionItem: CollectionItem = {
        objectId: game.objectId,
        name: game.details.name,
        image: game.details.imageurl,
        thumbnail: game.details.images.thumb,
        subtitle: game.details.yearpublished,
        yearpublished: game.details.yearpublished,
        collectionDetails: game.collectionDetails,
      }

      ;({ collection } = await addOrUpdateGameInCollectionReducer(
        global,
        dispatch,
        collectionItem
      ))
    } else {
      game.collectionDetails.collectionStatus = EMPTY_GAME_COLLECTION_STATUS
      game.collectionDetails.wishlistPriority = null
      ;({ collection } = await removeGameFromCollectionReducer(
        global,
        dispatch,
        game.objectId
      ))
    }

    return {
      [`game/${objectId}`]: {
        ...game,
      },
      collection,
    }
  } else {
    showMessage({
      message: "Failed to save item's collection status, please try again.",
      icon: 'auto',
      type: 'danger',
    })
  }
}
