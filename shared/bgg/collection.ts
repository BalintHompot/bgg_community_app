import * as Sentry from 'sentry-expo'
import { COLLECTION_STATES } from '../constants'
import { logger } from '../debug'
import { GameCollectionStatus } from '../store/types'
import styleconstants from '../styles/styleconstants'
import { getElementValue } from '../xml'
import { CollectionItem } from './types'
const XMLParser = require('react-xml-parser')

const timeout = (ms) => new Promise((res) => setTimeout(res, ms))

export const removeDuplicates = (myArr, prop) => {
  return myArr.filter((obj, pos, arr) => {
    return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos
  })
}

export const fetchCollectionFromBGG = async (
  username: string
): Promise<CollectionItem[]> => {
  if (!username) {
    return []
  }

  let collection: CollectionItem[] = []
  const url = `https://www.boardgamegeek.com/xmlapi2/collection?username=${username}`

  try {
    const response = await fetch(url)

    if (response.status == 202) {
      // collection is being prepared, come back late to try again
      logger('gonna sleep on it')
      await timeout(2000)
      return fetchCollectionFromBGG(username)
    } else if (response.status == 200) {
      // yay! we have a collection response
      //await nextFrame()
      const xml = await response.text()

      //await nextFrame()
      var doc = new XMLParser().parseFromString(xml)

      for (const item of doc.getElementsByTagName('item')) {
        //await nextFrame()

        const objectId = item.attributes.objectid
        const collectionId = item.attributes.collid

        const name = getElementValue(item, 'name')

        const yearpublished = getElementValue(item, 'yearpublished')

        const image = getElementValue(item, 'image')
        const thumbnail = getElementValue(item, 'thumbnail')
        let statusElement = item.getElementsByTagName('status')[0] || {}

        let subtitle = `Year: ${yearpublished}`

        console.log('loading collection from xml', statusElement.attributes)

        const collectionStatus: Partial<GameCollectionStatus> = {}

        COLLECTION_STATES.map(([_, key]) => {
          collectionStatus[key] = statusElement.attributes[key] === '1'
        })

        collection.push({
          objectId,
          name,
          subtitle,
          yearpublished,
          image,
          thumbnail,
          collectionDetails: {
            collectionId,
            collectionStatus: collectionStatus as GameCollectionStatus,
            wishlistPriority: statusElement.attributes['wishlist'],
          },
        })
      }

      // not really duplicates, just multiple copies, need to figure out how that should be handled? HELP???
      collection = removeDuplicates(collection, 'objectId')
    } else {
      // @ts-ignore
      Sentry.captureMessage(
        'Non 200/202 Response from BGG when loading collection.',
        'error'
      )
    }
  } catch (error) {
    // @ts-ignore
    Sentry.captureException(error)
  }
  console.log(collection[0])
  return collection
}

export function getRatingColor(rating) {
  if (rating > 8) {
    return '#1d804c'
  } else if (rating > 7) {
    return '#1978b3'
  } else if (rating > 5) {
    return styleconstants.bggpurple
  } else {
    return '#d71925'
  }
}
