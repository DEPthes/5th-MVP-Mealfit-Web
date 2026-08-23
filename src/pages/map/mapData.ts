import type { Cuisine, FoodType } from '@/api/types'
import type { RecommendationItem } from '@/api/recommendation'

export const CUISINE_FILTERS: ReadonlyArray<{
  label: string
  value: Cuisine
}> = [
  { label: '한식', value: 'KOREAN' },
  { label: '중식', value: 'CHINESE' },
  { label: '일식', value: 'JAPANESE' },
  { label: '양식', value: 'WESTERN' },
]

export const FOOD_TYPE_FILTERS: ReadonlyArray<{
  label: string
  value?: FoodType
}> = [
  { label: '전체' },
  { label: '고기', value: 'MEAT' },
  { label: '면', value: 'NOODLE' },
  { label: '밥', value: 'RICE' },
  { label: '찌개·국', value: 'SOUP' },
  { label: '분식', value: 'SNACK' },
]

export function formatMatchRate(rate?: number | null) {
  if (rate == null) {
    return '--'
  }

  return `${rate.toFixed(1).replace(/\.0$/, '')}%`
}

export function formatDistance(item: RecommendationItem) {
  if (item.distanceMeters == null) {
    return `${item.distanceBasis} 기준 거리 정보 없음`
  }

  return `${item.distanceBasis} 기준 ${item.distanceMeters}m`
}

export function formatRecommendationDetail(item: RecommendationItem) {
  const recommendation = item.menus[0]

  if (!recommendation) {
    return '조건에 맞는 메뉴 정보가 없습니다.'
  }

  const { menu, proteinTargetPercent } = recommendation
  const details = [menu.menuName]

  if (menu.nutrition?.protein != null) {
    details.push(`단백질 ${menu.nutrition.protein}g`)
  }

  if (proteinTargetPercent != null) {
    details.push(`하루 목표의 ${proteinTargetPercent}% 충족`)
  }

  if (menu.price != null) {
    details.push(`${menu.price.toLocaleString()}원`)
  }

  if (item.walkingMinutes != null) {
    details.push(`도보 ${item.walkingMinutes}분`)
  }

  return details.join(' · ')
}
