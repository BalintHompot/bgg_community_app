import { showMessage } from 'react-native-flash-message'
import { useDispatch } from 'reactn'
import { Native as Sentry } from 'sentry-expo'
import { DEFAULT_BGG_URL } from './constants'
import { logger } from './debug'
import { logOutReducer } from './store/reducers/authorization'

export const fetchRaw = async (path, args = {}, headers = {}) => {
  headers = new Headers(
    Object.assign(
      {
        accept: 'application/json',
        'content-type': 'application/json;charset=UTF-8',
        // Referer: `${DEFAULT_BGG_URL}/`,
      },
      headers
    )
  )
  const url = path.startsWith('http') ? path : `${DEFAULT_BGG_URL}${path}`
  console.log(url, { credentials: 'include', ...args, headers })
  return fetch(url, { credentials: 'include', ...args, headers })
}

export const asyncFetch = async ({ path, args = {}, headers = {} }) =>
  fetchJSON(path, args, headers)

export const fetchJSON = async (path, args: RequestInit = {}, headers = {}) => {
  try {
    const { body } = args
    body ? (args.body = JSON.stringify(body)) : null

    let response = await fetchRaw(path, args, headers)

    if (response.status == 200) {
      return response.json()
    } else if (response.status == 403) {
      forceLogOut()
    } else {
      logger(
        `Got status code: ${response.status} instead when fetching: ${path}`
      )
      Sentry.captureMessage('Non 200 Response for HTTP request.', {
        extra: { url: path, stauts: response.status },
      })
    }
  } catch (error) {
    console.error(`Error fetching: ${path}`)
    console.error(error)
    Sentry.captureException(error)
  }
}

export const fetchXML = async (path, args: RequestInit = {}, headers = {}) => {
  try {
    const { body } = args
    body ? (args.body = JSON.stringify(body)) : null

    let response = await fetchRaw(path, args, headers)

    if (response.status == 200) {
      const respXML = await response.text()
      return respXML
    } else if (response.status == 403) {
      forceLogOut()
    } else {
      logger(
        `Got status code: ${response.status} instead when fetching: ${path}`
      )
      Sentry.captureMessage('Non 200 Response for HTTP request.', {
        extra: { url: path, stauts: response.status },
      })
    }
  } catch (error) {
    console.error(`Error fetching: ${path}`)
    console.error(error)
    Sentry.captureException(error)
  }
}

const forceLogOut = () => {
  const logOut = useDispatch(logOutReducer)
  logOut()

  showMessage({
    message: 'Your session has expired, please log in again to continue.',
    type: 'danger',
    icon: 'auto',
    duration: 3000,
  })
}
