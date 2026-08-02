import styles from '@/styles/components/common/MatchBadge.module.css'

type MatchBadgeProps = {
  percent: string
  size?: 'sm' | 'md'
}

export function MatchBadge({ percent, size = 'sm' }: MatchBadgeProps) {
  return (
    <div className={`${styles.badge} ${styles[size]}`}>
      <span className={styles.value}>{percent}</span>
      <span className={styles.label}>MATCH</span>
    </div>
  )
}
