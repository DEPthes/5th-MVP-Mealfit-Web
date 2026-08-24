export const RESET_PASSWORD_PATH = '/reset-password'

export function getResetTokenFromSearch(
  search: string,
  searchParams: URLSearchParams,
  pathToken?: string,
) {
  const named =
    searchParams.get('token') ??
    searchParams.get('resetToken') ??
    searchParams.get('code')

  if (named) {
    return named
  }

  if (pathToken) {
    return pathToken
  }

  if (search.startsWith('?') && search.length > 1 && !search.includes('=')) {
    return decodeURIComponent(search.slice(1))
  }

  const entries = [...searchParams.entries()]

  if (entries.length === 1) {
    return entries[0][1] || entries[0][0]
  }

  return ''
}
