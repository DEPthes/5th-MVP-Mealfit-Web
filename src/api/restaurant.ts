import { apiFetch } from './client'
import type { ApiResponse, MenuSearchResponse, RestaurantResponse } from './types'

export interface RestaurantDetailResponse {
  restaurant: RestaurantResponse
  menus: MenuSearchResponse[]
}

export async function getRestaurant(
  id: number,
): Promise<ApiResponse<RestaurantDetailResponse>> {
  return apiFetch<ApiResponse<RestaurantDetailResponse>>(
    `/api/restaurants/${id}`,
    { method: 'GET' },
  )
}
