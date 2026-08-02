import type { Restaurant } from './mapData'
import { MatchBadge } from '@/components/common/MatchBadge'
import styles from '@/styles/pages/map/RestaurantCard.module.css'

type RestaurantCardProps = {
  restaurant: Restaurant
  selected?: boolean
  onClick?: () => void
}

export function RestaurantCard({
  restaurant,
  selected = false,
  onClick,
}: RestaurantCardProps) {
  return (
    <button
      type="button"
      className={selected ? `${styles.card} ${styles.selected}` : styles.card}
      onClick={onClick}
    >
      <div className={styles.top}>
        <div className={styles.info}>
          <p className={styles.name}>{restaurant.name}</p>
          <p className={styles.distance}>{restaurant.distance}</p>
        </div>
        <MatchBadge percent={restaurant.match} size="sm" />
      </div>
      <div className={styles.divider} />
      <p className={styles.detail}>{restaurant.detail}</p>
    </button>
  )
}
