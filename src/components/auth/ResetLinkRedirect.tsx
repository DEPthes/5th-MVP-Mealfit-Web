import { Navigate, Outlet, useLocation, useSearchParams } from 'react-router-dom'
import {
  RESET_PASSWORD_PATH,
  getResetTokenFromSearch,
} from '@/utils/resetLink'

const RESET_PATHS = [
  '/password-reset',
  '/reset-password',
  '/reset',
  '/password/reset',
]

function isResetPath(pathname: string) {
  return (
    RESET_PATHS.includes(pathname) || pathname.startsWith('/reset/')
  )
}

export function ResetLinkRedirect() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const token = getResetTokenFromSearch(location.search, searchParams)

  if (token && !isResetPath(location.pathname)) {
    return (
      <Navigate
        to={`${RESET_PASSWORD_PATH}?token=${encodeURIComponent(token)}`}
        replace
      />
    )
  }

  return <Outlet />
}
