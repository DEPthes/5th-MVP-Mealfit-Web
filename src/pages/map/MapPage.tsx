import {
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  getRecommendations,
  type RecommendationItem,
} from '@/api/recommendation'

import {
  getRestaurant,
  type RestaurantDetailResponse,
} from '@/api/restaurant'

import type {
  Cuisine,
  FoodType,
} from '@/api/types'

import magnifierIcon from '@/assets/icons/magnifier.svg'
import locationPinIcon from '@/assets/icons/location-pin.svg'
import locationSearchIcon from '@/assets/icons/location-search.svg'

import { Tag } from '@/components/common/Tag'

import { RestaurantCard } from './RestaurantCard'

import {
  CUISINE_FILTERS,
  FOOD_TYPE_FILTERS,
  formatDistance,
} from './mapData'

import {
  getKakaoRouteUrl,
  getRestaurantCoords,
} from './mapLocation'

import { loadKakaoMap } from './kakaoLoader'

import styles from '@/styles/pages/map/MapPage.module.css'

export function MapPage() {
  const [searchParams] = useSearchParams()

  const restaurantIdParam = searchParams.get('restaurantId')
  const requestedRestaurantId = restaurantIdParam ? Number(restaurantIdParam) : null
  const hasValidRestaurantId = requestedRestaurantId !== null && Number.isFinite(requestedRestaurantId)

  const [draftKeyword, setDraftKeyword] = useState('')
  const [keyword, setKeyword] = useState('')
  const [cuisine, setCuisine] = useState<Cuisine | undefined>(undefined)
  const [foodType, setFoodType] = useState<FoodType | undefined>(undefined)

  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [selectedDetail, setSelectedDetail] = useState<RestaurantDetailResponse | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isDetailLoading, setIsDetailLoading] = useState(false)

  const [errorMessage, setErrorMessage] = useState('')
  const [detailErrorMessage, setDetailErrorMessage] = useState('')
  const [mapErrorMessage, setMapErrorMessage] = useState('')

  const [refreshKey, setRefreshKey] = useState(0)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!hasValidRestaurantId || requestedRestaurantId === null) {
      return
    }

    let ignore = false

    const fetchRequestedRestaurant = async () => {
      setIsDetailLoading(true)
      setDetailErrorMessage('')

      try {
        const response = await getRestaurant(requestedRestaurantId)

        if (!response.success || !response.data) {
          throw new Error(response.message)
        }

        if (ignore) return

        const rest = response.data.restaurant
        setSelectedId(requestedRestaurantId)
        setSelectedDetail(response.data)

        if (rest.cuisine) {
          setCuisine(rest.cuisine as Cuisine)
        }
        if ((rest as any).foodType) {
          setFoodType((rest as any).foodType as FoodType)
        }
      } catch (error) {
        if (!ignore) {
          setSelectedDetail(null)
          setDetailErrorMessage(
            error instanceof Error
              ? error.message
              : '선택한 식당 정보를 불러오지 못했습니다.',
          )
        }
      } finally {
        if (!ignore) {
          setIsDetailLoading(false)
        }
      }
    }

    void fetchRequestedRestaurant()

    return () => {
      ignore = true
    }
  }, [hasValidRestaurantId, requestedRestaurantId])

  useEffect(() => {
    let ignore = false

    const fetchRecommendations = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await getRecommendations({
          keyword: keyword || undefined,
          cuisine,
          foodType,
          referencePoint: 'MAIN_GATE',
          page: 0,
          size: 10,
        })

        if (!response.success || !response.data) {
          throw new Error(response.message)
        }

        if (ignore) return

        const items = response.data.content
        setRecommendations(items)

        setSelectedId((currentId) => {
          if (
            hasValidRestaurantId &&
            items.some((item) => Number(item.restaurant.restaurantId) === Number(requestedRestaurantId))
          ) {
            return requestedRestaurantId
          }

          if (currentId !== null && items.some((item) => Number(item.restaurant.restaurantId) === Number(currentId))) {
            return currentId
          }

          return items[0]?.restaurant.restaurantId ?? requestedRestaurantId ?? null
        })
      } catch (error) {
        if (ignore) return

        setRecommendations([])
        setSelectedId(hasValidRestaurantId ? requestedRestaurantId : null)
        setErrorMessage(
          error instanceof Error
            ? error.message
            : '식당 추천을 불러오지 못했습니다.',
        )
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    void fetchRecommendations()

    return () => {
      ignore = true
    }
  }, [cuisine, foodType, keyword, refreshKey, hasValidRestaurantId, requestedRestaurantId])

  useEffect(() => {
    let ignore = false

    if (selectedId === null) {
      setSelectedDetail(null)
      return
    }

    if (Number(selectedDetail?.restaurant.restaurantId) === Number(selectedId)) {
      return
    }

    const fetchRestaurantDetail = async () => {
      setIsDetailLoading(true)
      setDetailErrorMessage('')

      try {
        const response = await getRestaurant(selectedId)

        if (!response.success || !response.data) {
          throw new Error(response.message)
        }

        if (!ignore) {
          setSelectedDetail(response.data)
        }
      } catch (error) {
        if (!ignore) {
          setSelectedDetail(null)
          setDetailErrorMessage(
            error instanceof Error
              ? error.message
              : '식당 상세 정보를 불러오지 못했습니다.',
          )
        }
      } finally {
        if (!ignore) {
          setIsDetailLoading(false)
        }
      }
    }

    void fetchRestaurantDetail()

    return () => {
      ignore = true
    }
  }, [selectedId, selectedDetail])

  const selectedRecommendation =
    recommendations.find(
      (item) => Number(item.restaurant.restaurantId) === Number(selectedId),
    ) ?? null

  const selectedRestaurant =
    Number(selectedDetail?.restaurant.restaurantId) === Number(selectedId)
      ? selectedDetail?.restaurant ?? null
      : (selectedRecommendation?.restaurant ?? null)

  const selectedCoords = getRestaurantCoords(selectedRestaurant)

  useEffect(() => {
    const container = mapContainerRef.current

    if (!container || !selectedCoords) {
      return
    }

    let cancelled = false
    let marker: any = null

    const initializeMap = async () => {
      try {
        setMapErrorMessage('')
        await loadKakaoMap()

        if (cancelled || !mapContainerRef.current) return

        const kakaoMaps = window.kakao?.maps
        if (!kakaoMaps) {
          throw new Error('카카오 지도 SDK를 불러오지 못했습니다.')
        }

        const position = new kakaoMaps.LatLng(
          selectedCoords.latitude,
          selectedCoords.longitude,
        )

        const map = new kakaoMaps.Map(mapContainerRef.current, {
          center: position,
          level: 3,
        })

        marker = new kakaoMaps.Marker({
          map,
          position,
          title: selectedRestaurant?.name ?? '선택한 식당',
        })
      } catch (error) {
        if (!cancelled) {
          setMapErrorMessage(
            error instanceof Error
              ? error.message
              : '카카오 지도를 불러오지 못했습니다.',
          )
        }
      }
    }

    void initializeMap()

    return () => {
      cancelled = true
      if (marker) {
        marker.setMap(null)
      }
      container.innerHTML = ''
    }
  }, [
    selectedRestaurant?.restaurantId,
    selectedCoords?.latitude,
    selectedCoords?.longitude,
    selectedRestaurant?.name,
  ])

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setKeyword(draftKeyword.trim())
  }

  const handleOpenKakaoMap = () => {
    if (!selectedRestaurant || !selectedCoords) {
      return
    }

    const kakaoMapUrl = getKakaoRouteUrl(
      selectedRestaurant.name,
      selectedCoords.latitude,
      selectedCoords.longitude,
    )

    window.open(kakaoMapUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>식당 검색 · 지도</h1>
        <p className={styles.description}>
          카테고리를 선택해가며 명지대 주변 식당을 좁혀서 찾고, 선택한 식당의
          위치와 방문 경로를 확인할 수 있습니다.
          <br />
          (검색 반경: 명지대 기준 1.05km 이내)
        </p>
      </header>

      <div className={styles.content}>
        <aside className={styles.panel}>
          <form className={styles.search} onSubmit={handleSearch}>
            <input
              className={styles.searchInput}
              type="search"
              placeholder="검색 식당명 또는 메뉴 검색(예: 보쌈, 연어덮밥)"
              aria-label="식당명 또는 메뉴 검색"
              value={draftKeyword}
              onChange={(e) => setDraftKeyword(e.target.value)}
            />
            <button
              type="submit"
              className={styles.searchButton}
              aria-label="검색"
            >
              <img
                src={magnifierIcon}
                alt=""
                width={25}
                height={25}
                className={styles.searchIcon}
              />
            </button>
          </form>

          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <p className={styles.filterTitle}>
                1. 음식 종류
              </p>
              <div className={styles.tags}>
                {CUISINE_FILTERS.map((filter) => (
                  <Tag
                    key={filter.value}
                    label={filter.label}
                    selected={cuisine === filter.value}
                    onClick={() =>
                      setCuisine((prev) => (prev === filter.value ? undefined : filter.value))
                    }
                  />
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <p className={styles.filterTitleStrong}>2. 세부 종류</p>
              <div className={styles.tags}>
                {FOOD_TYPE_FILTERS.map((filter) => (
                  <Tag
                    key={filter.label}
                    label={filter.label}
                    selected={foodType === filter.value}
                    onClick={() =>
                      setFoodType((prev) => (prev === filter.value ? undefined : filter.value))
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={styles.list} aria-busy={isLoading}>
            {isLoading && recommendations.length === 0 && (
              <p className={styles.status}>식당을 불러오는 중입니다.</p>
            )}

            {!isLoading && errorMessage && (
              <p className={`${styles.status} ${styles.error}`} role="alert">
                {errorMessage}
              </p>
            )}

            {!isLoading && !errorMessage && recommendations.length === 0 && (
              <p className={styles.status}>조건에 맞는 식당이 없습니다.</p>
            )}

            {recommendations.map((recommendation) => (
              <RestaurantCard
                key={recommendation.restaurant.restaurantId}
                recommendation={recommendation}
                selected={
                  Number(selectedId) === Number(recommendation.restaurant.restaurantId)
                }
                onClick={() =>
                  setSelectedId(recommendation.restaurant.restaurantId)
                }
              />
            ))}
          </div>
        </aside>

        <div className={styles.mapArea}>
          {selectedCoords ? (
            <div
              ref={mapContainerRef}
              className={styles.mapFrame}
              aria-label="카카오 지도"
            />
          ) : (
            <div
              className={styles.mapPlaceholder}
              aria-label="지도 영역"
            />
          )}

          {mapErrorMessage && (
            <div
              className={`${styles.mapStatus} ${styles.error}`}
              role="alert"
            >
              {mapErrorMessage}
            </div>
          )}

          <button
            type="button"
            className={styles.searchHere}
            onClick={() => setRefreshKey((current) => current + 1)}
          >
            <span>이 위치에서 검색</span>
            <img
              src={locationSearchIcon}
              alt=""
              width={15}
              height={19}
              className={styles.searchHereIcon}
            />
          </button>

          {selectedRestaurant && !selectedCoords && (
            <div className={styles.marker}>
              <div className={styles.markerPin}>
                <img
                  src={locationPinIcon}
                  alt=""
                  className={styles.markerPinImg}
                />
              </div>
              <p className={styles.markerLabel}>{selectedRestaurant.name}</p>
            </div>
          )}

          {selectedRestaurant && (
            <div className={styles.mapCard}>
              <div className={styles.mapCardInfo}>
                <p className={styles.mapCardName}>
                  {selectedRestaurant.name}
                </p>
                <p className={styles.mapCardDistance}>
                  {selectedRecommendation
                    ? formatDistance(selectedRecommendation)
                    : selectedRestaurant.address ?? '주소 정보 없음'}
                </p>
              </div>

              <button
                type="button"
                className={styles.routeButton}
                disabled={!selectedCoords}
                onClick={handleOpenKakaoMap}
              >
                경로 안내
              </button>
            </div>
          )}

          {selectedId !== null &&
            (isDetailLoading || detailErrorMessage) && (
              <p
                className={`${styles.mapStatus} ${
                  detailErrorMessage ? styles.error : ''
                }`}
                role={detailErrorMessage ? 'alert' : 'status'}
              >
                {detailErrorMessage ||
                  '식당 상세 정보를 불러오는 중입니다.'}
              </p>
            )}
        </div>
      </div>
    </section>
  )
}