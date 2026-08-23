export type ScoreChartItem = {
  measuredAt: string
  inbodyScore: number
}

export type ScoreChartPoint = {
  x: number
  y: number
  label: string
  score: number
}

export function formatChartDate(date: string) {
  const parts = date.split('-')

  if (parts.length < 3) {
    return date
  }

  return `${Number(parts[1])}/${Number(parts[2])}`
}

export function buildScoreChart(
  items: ScoreChartItem[],
  width = 320,
  height = 140,
) {
  const left = 40
  const right = width - 16
  const top = 20
  const bottom = height - 28
  const scores = items.map((item) => item.inbodyScore)
  const maxScore = Math.max(70, ...scores, 10)
  const minScore = Math.min(10, ...scores, 0)
  const range = Math.max(maxScore - minScore, 1)
  const ticks = [0, 1, 2, 3].map((step) =>
    Math.round(maxScore - (range * step) / 3),
  )

  const points: ScoreChartPoint[] = items.map((item, index) => {
    const x =
      items.length === 1
        ? (left + right) / 2
        : left + ((right - left) * index) / (items.length - 1)
    const y = top + ((maxScore - item.inbodyScore) / range) * (bottom - top)

    return {
      x,
      y,
      label: formatChartDate(item.measuredAt),
      score: item.inbodyScore,
    }
  })

  return {
    points,
    ticks: ticks.map((value) => ({
      value,
      y: top + ((maxScore - value) / range) * (bottom - top),
    })),
    left,
    right,
    top,
    bottom,
  }
}
