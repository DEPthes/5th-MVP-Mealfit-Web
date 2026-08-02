import { useState } from 'react'
import magnifierIcon from '@/assets/icons/magnifier.svg'
import locationPinIcon from '@/assets/icons/location-pin.svg'
import locationSearchIcon from '@/assets/icons/location-search.svg'
import { Tag } from '@/components/common/Tag'
import { RestaurantCard } from './RestaurantCard'
import {
  DETAIL_TYPES,
  FOOD_TYPES,
  RESTAURANTS,
} from './mapData'
import styles from '@/styles/pages/map/MapPage.module.css'

export function MapPage() {
  const [foodType, setFoodType] = useState<string>('일식')
  const [detailType, setDetailType] = useState<string>('고기')
  const [selectedId, setSelectedId] = useState<string>(RESTAURANTS[0].id)

  const selectedRestaurant =
    RESTAURANTS.find((item) => item.id === selectedId) ?? RESTAURANTS[0]

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
          <label className={styles.search}>
            <input
              className={styles.searchInput}
              type="search"
              placeholder="검색 식당명  또는 메뉴 검색(예: 보쌈, 연어덮밥)"
            />
            <img
              src={magnifierIcon}
              alt=""
              width={25}
              height={25}
              className={styles.searchIcon}
            />
          </label>

          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <p className={styles.filterTitle}>
                1. 음식 종류 <span className={styles.required}>(필수)</span>
              </p>
              <div className={styles.tags}>
                {FOOD_TYPES.map((type) => (
                  <Tag
                    key={type}
                    label={type}
                    selected={foodType === type}
                    onClick={() => setFoodType(type)}
                  />
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <p className={styles.filterTitleStrong}>2. 세부 종류</p>
              <div className={styles.tags}>
                {DETAIL_TYPES.map((type) => (
                  <Tag
                    key={type}
                    label={type}
                    selected={detailType === type}
                    onClick={() => setDetailType(type)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={styles.list}>
            {RESTAURANTS.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                selected={selectedId === restaurant.id}
                onClick={() => setSelectedId(restaurant.id)}
              />
            ))}
          </div>
        </aside>

        <div className={styles.mapArea}>
          <div className={styles.mapPlaceholder} aria-label="지도 영역" />

          <button type="button" className={styles.searchHere}>
            <span>이 위치에서 검색</span>
            <img
              src={locationSearchIcon}
              alt=""
              width={15}
              height={19}
              className={styles.searchHereIcon}
            />
          </button>

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

          <div className={styles.mapCard}>
            <div className={styles.mapCardInfo}>
              <p className={styles.mapCardName}>{selectedRestaurant.name}</p>
              <p className={styles.mapCardDistance}>{selectedRestaurant.distance}</p>
            </div>
            <button type="button" className={styles.routeButton}>
              경로 안내
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
