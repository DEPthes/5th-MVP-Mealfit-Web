import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import styles from '@/styles/components/layout/Layout.module.css'

export function Layout() {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}
