import { CollectionDetails } from '../../store/types'

// summary structure we use for collection items (comes as xml from BGG)
export interface CollectionItem {
  objectId: string
  name: string
  subtitle: string
  yearpublished: string
  image: string
  thumbnail: string
  collectionDetails: CollectionDetails
}
