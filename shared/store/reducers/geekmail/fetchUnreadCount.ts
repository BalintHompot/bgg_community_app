import { fetchJSON } from '../../../HTTP'

export const getNumUnreadReducer = async () => {
  const { numunread } = await fetchJSON(
    '/api/geekmail/messages?metaonly=1&numunread=1'
  )

  return { numUnread: numunread }
}
