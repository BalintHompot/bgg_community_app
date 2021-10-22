import { fetchCollectionFromBGG } from '../../../bgg/collection'
import { STORAGE_KEYS } from '../../../constants'
import { persistGlobal } from '../../helpers/persistence'

export const fetchCollectionReducer = async (state) => {
  const { username } = state.bggCredentials
  const collection = await fetchCollectionFromBGG(username)

  const collectionFetchedAt = new Date().getTime()

  persistGlobal(STORAGE_KEYS.collection, { collection, collectionFetchedAt })

  return { collection, collectionFetchedAt }
}
