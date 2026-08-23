import { apiFetch, buildQuery } from './client'
import type {
  ApiResponse,
  Cuisine,
  FoodType,
  MenuSearchResponse,
  PageResponse,
  RestaurantResponse,
} from './types'

export interface MenuSearchParams {
  keyword?: string
  cuisine?: Cuisine
  foodType?: FoodType
  page?: number
  size?: number
  sort?: string
}

export interface RestaurantSearchParams {
  keyword?: string
  cuisine?: Cuisine
  page?: number
  size?: number
  sort?: string
}

export interface RestaurantDetailResponse {
  restaurant: RestaurantResponse
  menus: MenuSearchResponse[]
}

export async function searchMenus(
  params: MenuSearchParams = {},
): Promise<ApiResponse<PageResponse<MenuSearchResponse>>> {
  return apiFetch<ApiResponse<PageResponse<MenuSearchResponse>>>(
    `/api/restaurants/menus${buildQuery(params)}`,
    { method: 'GET' },
  )
}

export async function getRestaurants(
  params: RestaurantSearchParams = {},
): Promise<ApiResponse<PageResponse<RestaurantResponse>>> {
  return apiFetch<ApiResponse<PageResponse<RestaurantResponse>>>(
    `/api/restaurants${buildQuery(params)}`,
    { method: 'GET' },
  )
}

export async function getRestaurant(
  id: number,
): Promise<ApiResponse<RestaurantDetailResponse>> {
  return apiFetch<ApiResponse<RestaurantDetailResponse>>(
    `/api/restaurants/${id}`,
    { method: 'GET' },
  )
}
