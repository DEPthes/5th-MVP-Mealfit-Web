import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getMyProfile } from '@/api/member'
import { NAV_ITEMS } from '@/constants/navigation'
import logoIcon from '@/assets/icons/logo.svg'
import chevronDown from '@/assets/icons/chevron-down.svg'
import {
  AUTH_SESSION_CHANGE_EVENT,
  clearAuthSession,
  getAccessToken,
  getStoredNickname,
} from '@/utils/authSession'
import styles from '@/styles/components/layout/Header.module.css'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [nickname, setNickname] = useState<string | null>(
    getStoredNickname,
  )
  const navigate = useNavigate()

  useEffect(() => {
    let ignore = false

    const syncProfile = async () => {
      if (!getAccessToken()) {
        if (!ignore) {
          setNickname(null)
        }
        return
      }

      try {
        const response = await getMyProfile()

        if (!ignore && response.success && response.data) {
          setNickname(response.data.nickname)
        }
      } catch {
        // 저장된 닉네임을 fallback으로 유지한다.
      }
    }

    const updateNickname = () => {
      setNickname(getStoredNickname())
      setIsOpen(false)
      void syncProfile()
    }

    void syncProfile()
    window.addEventListener(AUTH_SESSION_CHANGE_EVENT, updateNickname)
    window.addEventListener('storage', updateNickname)

    return () => {
      ignore = true
      window.removeEventListener(AUTH_SESSION_CHANGE_EVENT, updateNickname)
      window.removeEventListener('storage', updateNickname)
    }
  }, [])

  const toggleDropdown = () => {
    if (!nickname) {
      navigate('/login')
      return
    }

    setIsOpen((prev) => !prev)
  }

  const handleLogout = () => {
    clearAuthSession()
    setIsOpen(false)
    navigate('/login')
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link 
            to="/" 
            className={styles.logo} 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <img
              src={logoIcon}
              alt="MealFit 로고"
              style={{ width: '28px', height: '28px', objectFit: 'contain' }}
            />
            MealFit
          </Link>
          <nav className={styles.nav} aria-label="주요 메뉴">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className={styles.profileContainer}>
          <button 
            type="button" 
            className={styles.profile} 
            aria-label="프로필 메뉴"
            onClick={toggleDropdown}
          >
            <span>{nickname ?? '로그인'}</span>
            <img
              src={chevronDown}
              alt=""
              width={10}
              height={5}
              className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
            />
          </button>

          {isOpen && nickname && (
            <div className={styles.dropdown}>
              <Link 
                to="/mypage" 
                className={styles.dropdownItem}
                onClick={() => setIsOpen(false)}
              >
                마이페이지
              </Link>
              <button 
                type="button" 
                className={styles.dropdownItem}
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}