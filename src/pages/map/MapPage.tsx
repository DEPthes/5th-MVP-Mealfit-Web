import { type FormEvent, useEffect, useState } from 'react'
import {
  getRecommendations,
  type RecommendationItem,
} from '@/api/recommendation'
import { getRestaurant, type RestaurantDetailResponse } from '@/api/restaurant'
import type { Cuisine, FoodType } from '@/api/types'
import magnifierIcon from '@/assets/icons/magnifier.svg'
import locationPinIcon from '@/assets/icons/location-pin.svg'
import locationSearchIcon from '@/assets/icons/location-search.svg'
import { Tag } from '@/components/common/Tag'
import { RestaurantCard } from './RestaurantCard'
import { CUISINE_FILTERS, FOOD_TYPE_FILTERS, formatDistance } from './mapData'
import styles from '@/styles/pages/map/MapPage.module.css'

export function MapPage() {
  const [draftKeyword, setDraftKeyword] = useState('')
  const [keyword, setKeyword] = useState('')
  const [cuisine, setCuisine] = useState<Cuisine>('JAPANESE')
  const [foodType, setFoodType] = useState<FoodType | undefined>('MEAT')
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(
    [],
  )
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [selectedDetail, setSelectedDetail] =
    useState<RestaurantDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [detailErrorMessage, setDetailErrorMessage] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

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
          size: 4,
        })

        if (!response.success || !response.data) {
          throw new Error(response.message)
        }

        if (ignore) {
          return
        }

        const items = response.data.content
        setRecommendations(items)
        setSelectedId((currentId) => {
          const hasCurrentItem = items.some(
            (item) => item.restaurant.restaurantId === currentId,
          )

          return hasCurrentItem
            ? currentId
            : (items[0]?.restaurant.restaurantId ?? null)
        })
      } catch (error) {
        if (ignore) {
          return
        }

        setRecommendations([])
        setSelectedId(null)
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
  }, [cuisine, foodType, keyword, refreshKey])

  useEffect(() => {
    let ignore = false

    if (selectedId === null) {
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
  }, [selectedId])

  const selectedRecommendation =
    recommendations.find(
      (item) => item.restaurant.restaurantId === selectedId,
    ) ?? null

  const selectedRestaurant =
    selectedDetail?.restaurant.restaurantId === selectedId
      ? selectedDetail.restaurant
      : (selectedRecommendation?.restaurant ?? null)

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setKeyword(draftKeyword.trim())
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
              placeholder="검색 식당명  또는 메뉴 검색(예: 보쌈, 연어덮밥)"
              aria-label="식당명 또는 메뉴 검색"
              value={draftKeyword}
              onChange={(event) => setDraftKeyword(event.target.value)}
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
                1. 음식 종류 <span className={styles.required}>(필수)</span>
              </p>
              <div className={styles.tags}>
                {CUISINE_FILTERS.map((filter) => (
                  <Tag
                    key={filter.value}
                    label={filter.label}
                    selected={cuisine === filter.value}
                    onClick={() => setCuisine(filter.value)}
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
                    onClick={() => setFoodType(filter.value)}
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
                selected={selectedId === recommendation.restaurant.restaurantId}
                onClick={() =>
                  setSelectedId(recommendation.restaurant.restaurantId)
                }
              />
            ))}
          </div>
        </aside>

        <div className={styles.mapArea}>
          <div className={styles.mapPlaceholder} aria-label="지도 영역" />

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

          {selectedRestaurant && (
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

          {selectedRestaurant && selectedRecommendation && (
            <div className={styles.mapCard}>
              <div className={styles.mapCardInfo}>
                <p className={styles.mapCardName}>{selectedRestaurant.name}</p>
                <p className={styles.mapCardDistance}>
                  {formatDistance(selectedRecommendation)}
                </p>
              </div>
              <button type="button" className={styles.routeButton}>
                경로 안내
              </button>
            </div>
          )}

          {selectedId !== null && (isDetailLoading || detailErrorMessage) && (
            <p
              className={`${styles.mapStatus} ${
                detailErrorMessage ? styles.error : ''
              }`}
              role={detailErrorMessage ? 'alert' : 'status'}
            >
              {detailErrorMessage || '식당 상세 정보를 불러오는 중입니다.'}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
