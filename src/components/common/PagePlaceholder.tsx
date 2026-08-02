import styles from '@/styles/components/common/PagePlaceholder.module.css'

type PagePlaceholderProps = {
  title: string
}

export function PagePlaceholder({ title }: PagePlaceholderProps) {
  return (
    <section className={styles.section}>
      <h1 className={styles.title}>{title}</h1>
    </section>
  )
}
