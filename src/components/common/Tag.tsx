import styles from '@/styles/components/common/Tag.module.css'

type TagProps = {
  label: string
  selected?: boolean
  size?: 'sm' | 'md'
  onClick?: () => void
}

export function Tag({
  label,
  selected = false,
  size = 'md',
  onClick,
}: TagProps) {
  const className = [
    styles.tag,
    styles[size],
    selected ? styles.selected : '',
  ]
    .filter(Boolean)
    .join(' ')

  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {label}
      </button>
    )
  }

  return <span className={className}>{label}</span>
}
