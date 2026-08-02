import { Link, NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '@/constants/navigation'
import chevronDown from '@/assets/icons/chevron-down.svg'
import styles from '@/styles/components/layout/Header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link to="/" className={styles.logo}>
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

        <button type="button" className={styles.profile} aria-label="프로필 메뉴">
          <span>김명지</span>
          <img
            src={chevronDown}
            alt=""
            width={10}
            height={5}
            className={styles.chevron}
          />
        </button>
      </div>
    </header>
  )
}
