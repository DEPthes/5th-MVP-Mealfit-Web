import { Link } from 'react-router-dom'
import { FOOTER_LINKS } from '@/constants/navigation'
import styles from '@/styles/components/layout/Footer.module.css'

function FooterDivider() {
  return (
    <svg
      className={styles.divider}
      width="1200"
      height="1"
      viewBox="0 0 1200 1"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path d="M0 0.5H1200" stroke="var(--Sub-Color-5, #D4D5D9)" strokeWidth="1" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <FooterDivider />

        <div className={styles.top}>
          <Link to="/" className={styles.logo}>
            MealFit
          </Link>
          <nav className={styles.links} aria-label="푸터 메뉴">
            {FOOTER_LINKS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={
                  item.path === '/privacy'
                    ? `${styles.link} ${styles.linkPrivacy}`
                    : styles.link
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <FooterDivider />

        <div className={styles.bottom}>
          <div className={styles.copyright}>
            <p>© 2026 MealFit · Team 건강 연구소 (Health Lab)</p>
            <p>
              DEPth 5th MVP Project · 본 서비스는 명지대학교 인근 상권으로 한정되어
              제공됩니다.
            </p>
          </div>
          <p className={styles.contact}>문의 : mealfit.depth5@example.com</p>
        </div>
      </div>
    </footer>
  )
}
