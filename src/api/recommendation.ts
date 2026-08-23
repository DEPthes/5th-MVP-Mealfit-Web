import { apiFetch, buildQuery } from './client'
import type {
  ApiResponse,
  Cuisine,
  FoodType,
  MatchReason,
  MenuSearchResponse,
  NutritionFilter,
  PageResponse,
  ReferencePoint,
  RestaurantResponse,
} from './types'

export interface RecommendationParams {
  keyword?: string
  cuisine?: Cuisine
  foodType?: FoodType
  nutritionFilter?: NutritionFilter
  maxPrice?: number
  referencePoint?: ReferencePoint
  page?: number
  size?: number
}

export interface RecommendedMenu {
  menu: MenuSearchResponse
  matchRate?: number
  proteinTargetPercent?: number
  warnings: string[]
}

export interface RecommendationItem {
  restaurant: RestaurantResponse
  menus: RecommendedMenu[]
  matchedMenuCount: number
  matchReason: MatchReason
  topMatchRate?: number
  distanceMeters?: number
  walkingMinutes?: number
  distanceBasis: string
}

export async function getRecommendations(
  params: RecommendationParams = {},
): Promise<ApiResponse<PageResponse<RecommendationItem>>> {
  return apiFetch<ApiResponse<PageResponse<RecommendationItem>>>(
    `/api/recommendations${buildQuery(params)}`,
    { method: 'GET' },
  )
}
