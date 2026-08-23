const ACCESS_TOKEN_KEY = 'accessToken'
const MEMBER_ID_KEY = 'memberId'
const NICKNAME_KEY = 'nickname'

export const AUTH_SESSION_CHANGE_EVENT = 'mealfit:auth-session-change'

type AuthSession = {
  accessToken: string
  memberId: number
  nickname: string
}

function notifyAuthSessionChange() {
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGE_EVENT))
}

export function saveAuthSession(session: AuthSession) {
  localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken)
  localStorage.setItem(MEMBER_ID_KEY, String(session.memberId))
  localStorage.setItem(NICKNAME_KEY, session.nickname)
  notifyAuthSessionChange()
}

export function clearAuthSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(MEMBER_ID_KEY)
  localStorage.removeItem(NICKNAME_KEY)
  notifyAuthSessionChange()
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getStoredNickname() {
  return localStorage.getItem(NICKNAME_KEY)
}

export function updateStoredNickname(nickname: string) {
  localStorage.setItem(NICKNAME_KEY, nickname)
  notifyAuthSessionChange()
}
