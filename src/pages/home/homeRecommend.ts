import type { RecommendationItem } from '@/api/recommendation'
import type { NutritionFilter } from '@/api/types'

export type HomeFilter = {
  label: string
  maxPrice?: number
  nutritionFilter?: NutritionFilter
}

export const HOME_FILTERS: HomeFilter[] = [
  { label: '1만원 이하', maxPrice: 10000 },
  { label: '역류성식도염 안전' },
  { label: '고단백', nutritionFilter: 'HIGH_PROTEIN' },
  { label: '저지방', nutritionFilter: 'LOW_FAT' },
  { label: '저탄수', nutritionFilter: 'LOW_CARB' },
  { label: '고탄수', nutritionFilter: 'HIGH_CARB' },
  { label: '저나트륨', nutritionFilter: 'LOW_SODIUM' },
]

export function formatMatchRate(rate?: number | null) {
  if (rate == null) {
    return '--'
  }

  return `${rate.toFixed(1).replace(/\.0$/, '')}%`
}

export function formatHomeDetail(
  item: RecommendationItem,
  proteinGoal?: number | null,
) {
  const recommendation = item.menus[0]

  if (!recommendation) {
    return '조건에 맞는 메뉴 정보가 없습니다.'
  }

  const details: string[] = []
  const protein = recommendation.menu.nutrition?.protein

  if (protein != null) {
    details.push(`단백질 ${protein}g`)
  }

  if (recommendation.proteinTargetPercent != null) {
    details.push(
      proteinGoal == null
        ? `하루 목표의 ${recommendation.proteinTargetPercent}% 충족`
        : `하루 목표(${proteinGoal}g)의 ${recommendation.proteinTargetPercent}% 충족`,
    )
  }

  return details.join(' · ') || recommendation.menu.menuName
}

export function formatHomeRestaurant(item: RecommendationItem) {
  const distance =
    item.distanceMeters == null
      ? `${item.distanceBasis} 기준 거리 정보 없음`
      : `${item.distanceBasis} 기준 ${item.distanceMeters} m`

  return `${item.restaurant.name} · ${distance}`
}

export function formatHomePrice(item: RecommendationItem) {
  const recommendation = item.menus[0]
  const parts: string[] = []

  if (recommendation?.menu.price != null) {
    parts.push(`${recommendation.menu.price.toLocaleString()}원`)
  }

  if (item.walkingMinutes != null) {
    parts.push(`도보 ${item.walkingMinutes}분`)
  }

  return parts.join(' · ')
}
