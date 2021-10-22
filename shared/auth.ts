import { fetchJSON, fetchRaw } from './HTTP'

export const logIn = async (username, password) => {
  const init = {
    method: 'POST',
    body: JSON.stringify({
      credentials: { username, password },
    }),
  }

  const { status } = await fetchRaw('/login/api/v1', init)

  if (status === 200 || status === 202) {
    return { success: true }
  } else {
    return { success: false }
  }
}

export const getUserId = async () => fetchJSON('/api/users/current')
