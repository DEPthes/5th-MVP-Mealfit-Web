import type { RestaurantResponse } from '@/api/types'

export function getRestaurantCoords(restaurant?: RestaurantResponse | null) {
  if (
    restaurant == null ||
    restaurant.latitude == null ||
    restaurant.longitude == null
  ) {
    return null
  }

  return {
    latitude: restaurant.latitude,
    longitude: restaurant.longitude,
  }
}

export function getOsmEmbedUrl(latitude: number, longitude: number) {
  const delta = 0.004
  const bbox = [
    longitude - delta,
    latitude - delta,
    longitude + delta,
    latitude + delta,
  ].join(',')

  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`
}

export function getKakaoRouteUrl(
  name: string,
  latitude: number,
  longitude: number,
) {
  return `https://map.kakao.com/link/to/${encodeURIComponent(name)},${latitude},${longitude}`
}
