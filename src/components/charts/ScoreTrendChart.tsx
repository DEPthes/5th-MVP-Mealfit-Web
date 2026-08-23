import {
  buildScoreChart,
  type ScoreChartItem,
} from '@/utils/scoreChart'

type ScoreTrendChartProps = {
  items: ScoreChartItem[]
  width?: number
  height?: number
  showAxes?: boolean
  emptyText?: string
  className?: string
  emptyClassName?: string
  gridClassName?: string
  lineClassName?: string
  pointClassName?: string
  yTextClassName?: string
  xTextClassName?: string
}

export function ScoreTrendChart({
  items,
  width = 320,
  height = 140,
  showAxes = true,
  emptyText = '점수 이력이 없습니다.',
  className,
  emptyClassName,
  gridClassName,
  lineClassName,
  pointClassName,
  yTextClassName,
  xTextClassName,
}: ScoreTrendChartProps) {
  if (items.length === 0) {
    return <p className={emptyClassName}>{emptyText}</p>
  }

  const chart = buildScoreChart(items, width, height)

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
    >
      {showAxes &&
        chart.ticks.map((tick) => (
          <g key={tick.value}>
            <line
              x1={chart.left - 10}
              y1={tick.y}
              x2={chart.right}
              y2={tick.y}
              className={gridClassName}
            />
            <text
              x="5"
              y={tick.y + 4}
              className={yTextClassName}
            >
              {tick.value}
            </text>
          </g>
        ))}

      {chart.points.length > 1 && (
        <polyline
          fill="none"
          points={chart.points
            .map((point) => `${point.x},${point.y}`)
            .join(' ')}
          className={lineClassName}
        />
      )}

      {chart.points.map((point) => (
        <g key={`${point.label}-${point.x}`}>
          <circle
            cx={point.x}
            cy={point.y}
            r={4}
            className={pointClassName}
          />
          {showAxes && (
            <text
              x={point.x}
              y={height - 6}
              textAnchor="middle"
              className={xTextClassName}
            >
              {point.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}
