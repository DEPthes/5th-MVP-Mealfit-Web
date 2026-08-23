import type { RecommendationItem } from '@/api/recommendation'
import { MatchBadge } from '@/components/common/MatchBadge'
import {
  formatDistance,
  formatMatchRate,
  formatRecommendationDetail,
} from './mapData'
import styles from '@/styles/pages/map/RestaurantCard.module.css'

type RestaurantCardProps = {
  recommendation: RecommendationItem
  selected?: boolean
  onClick?: () => void
}

export function RestaurantCard({
  recommendation,
  selected = false,
  onClick,
}: RestaurantCardProps) {
  const { restaurant, topMatchRate } = recommendation

  return (
    <button
      type="button"
      className={selected ? `${styles.card} ${styles.selected}` : styles.card}
      onClick={onClick}
    >
      <div className={styles.top}>
        <div className={styles.info}>
          <p className={styles.name}>{restaurant.name}</p>
          <p className={styles.distance}>{formatDistance(recommendation)}</p>
        </div>
        <MatchBadge percent={formatMatchRate(topMatchRate)} size="sm" />
      </div>
      <div className={styles.divider} />
      <p className={styles.detail}>
        {formatRecommendationDetail(recommendation)}
      </p>
    </button>
  )
}
