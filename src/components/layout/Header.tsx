import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { NAV_ITEMS } from '@/constants/navigation'
import logoIcon from '@/assets/icons/logo.svg'
import chevronDown from '@/assets/icons/chevron-down.svg'
import styles from '@/styles/components/layout/Header.module.css'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev)
  }

  const handleLogout = () => {
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
            <span>김명지</span>
            <img
              src={chevronDown}
              alt=""
              width={10}
              height={5}
              className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
            />
          </button>

          {isOpen && (
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