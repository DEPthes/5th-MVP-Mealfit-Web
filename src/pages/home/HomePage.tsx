import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './HomePage.module.css'
import mapIcon from '@/assets/icons/map.svg'
import uploadIcon from '@/assets/icons/share.svg'

import {
  getLatestInbody,
  type InbodyResponse,
} from '@/api/inbody'
import {
  getMyTargets,
  getScoreHistory,
  type ScoreHistoryItem,
  type TargetResponse,
} from '@/api/analysis'
import {
  getMyProfile,
  type MemberProfile,
} from '@/api/member'
import {
  getRecommendations,
  type RecommendationItem,
} from '@/api/recommendation'
import { ScoreTrendChart } from '@/components/charts/ScoreTrendChart'
import {
  formatHomeDetail,
  formatHomePrice,
  formatHomeRestaurant,
  formatMatchRate,
  HOME_FILTERS,
} from './homeRecommend'

const goalLabels: Record<string, string> = {
  LOSS: '체중 감량',
  MAINTAIN: '체중 유지',
  GAIN: '근육량 증가',
}

const exerciseLabels: Record<string, string> = {
  NONE: '운동 없음',
  LIGHT: '주 1~2회',
  MODERATE: '주 3~4회',
  ACTIVE: '주 5~6회',
}

const diseaseLabels: Record<string, string> = {
  GASTROESOPHAGEAL_REFLUX: '역류성 식도염',
  HYPERTENSION: '고혈압',
  DIABETES: '당뇨',
  HYPERLIPIDEMIA: '고지혈증',
}

export function HomePage() {
  const navigate = useNavigate()

  const [selectedFilter, setSelectedFilter] = useState(
    HOME_FILTERS[0].label,
  )

  const [recommendations, setRecommendations] = useState<
    RecommendationItem[]
  >([])

  const [isRecommendLoading, setIsRecommendLoading] =
    useState(true)

  const [recommendError, setRecommendError] = useState('')

  const [inbodyData, setInbodyData] =
    useState<InbodyResponse | null>(null)

  const [targetData, setTargetData] =
    useState<TargetResponse | null>(null)

  const [profile, setProfile] =
    useState<MemberProfile | null>(null)

  const [scoreHistory, setScoreHistory] = useState<
    ScoreHistoryItem[]
  >([])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true)

      try {
        try {
          const response = await getMyProfile()

          if (response.data) {
            setProfile(response.data)
          }
        } catch (error) {
          console.error('회원 정보 조회 실패:', error)
        }

        try {
          const response = await getLatestInbody()

          if (response.data) {
            setInbodyData(response.data)
          }
        } catch (error) {
          console.info('최신 인바디가 없습니다.', error)
        }

        try {
          const response = await getMyTargets()

          if (response.data) {
            setTargetData(response.data)
          }
        } catch (error) {
          console.info('목표 영양치가 없습니다.', error)
        }

        try {
          const response = await getScoreHistory()

          if (response.data) {
            setScoreHistory(
              [...response.data].sort((a, b) =>
                a.measuredAt.localeCompare(b.measuredAt),
              ),
            )
          }
        } catch (error) {
          console.info('점수 이력이 없습니다.', error)
        }
      } finally {
        setIsLoading(false)
      }
    }

    void fetchHomeData()
  }, [])

  useEffect(() => {
    let ignore = false

    const fetchRecommendations = async () => {
      const filter = HOME_FILTERS.find(
        (item) => item.label === selectedFilter,
      )

      setIsRecommendLoading(true)
      setRecommendError('')

      try {
        const response = await getRecommendations({
          maxPrice: filter?.maxPrice,
          nutritionFilter: filter?.nutritionFilter,
          referencePoint: 'MAIN_GATE',
          page: 0,
          size: 5,
        })

        if (!response.success || !response.data) {
          throw new Error(response.message)
        }

        if (!ignore) {
          setRecommendations(response.data.content)
        }
      } catch (error) {
        if (!ignore) {
          setRecommendations([])
          setRecommendError(
            error instanceof Error
              ? error.message
              : '추천 메뉴를 불러오지 못했습니다.',
          )
        }
      } finally {
        if (!ignore) {
          setIsRecommendLoading(false)
        }
      }
    }

    void fetchRecommendations()

    return () => {
      ignore = true
    }
  }, [selectedFilter])

  const calories =
    targetData?.dailyTarget?.calories ?? null

  const protein =
    targetData?.dailyTarget?.protein ?? null

  const goal = profile?.goal
    ? goalLabels[profile.goal] ?? profile.goal
    : '-'

  const activityLevel = profile?.exerciseCount
    ? exerciseLabels[profile.exerciseCount] ??
      profile.exerciseCount
    : '운동량 미설정'

  const diseases = profile?.diseases ?? []

  const diseaseText =
    diseases.length > 0
      ? diseases
          .map(
            (disease) =>
              diseaseLabels[disease] ?? disease,
          )
          .join(', ')
      : '없음'

  return (
    <div className={styles.pageWrapper}>
      <h1 className={styles.pageTitle}>
        홈 - 내 헬스 스펙 & 나만의 추천메뉴
      </h1>

      <div className={styles.contentContainer}>
        <aside className={styles.leftBoard}>
          <div className={styles.boardHeader}>
            <span className={styles.boardTitle}>
              MY HEALTH SPEC BOARD
            </span>
          </div>

          <div className={styles.inbodyNoticeCard}>
            <p className={styles.inbodyText}>
              {inbodyData ? (
                inbodyData.stale ? (
                  <>
                    측정일이 오래되어 갱신이 필요해요.
                    <br />
                    인바디를 다시 업로드해 주세요.
                  </>
                ) : (
                  <>
                    최신 인바디 데이터가 반영되어 있어요.
                    <br />
                    새로 업로드하면 더 정확해져요.
                  </>
                )
              ) : (
                <>
                  아직 인바디 데이터가 없어요.
                  <br />
                  건강 데이터를 입력해 주세요.
                </>
              )}
            </p>

            <button
              type="button"
              className={styles.uploadBtn}
              onClick={() => navigate('/health-data')}
            >
              업로드
              <img
                src={uploadIcon}
                alt=""
                className={styles.uploadIcon}
              />
            </button>
          </div>

          <div className={styles.divider} />

          <div>
            <div className={styles.sectionTitle}>
              인바디 점수 추이{' '}
              <span className={styles.sectionSubTitle}>
                (최근 측정)
              </span>
            </div>

            <div className={styles.graphBox}>
              <ScoreTrendChart
                items={scoreHistory}
                className={styles.chartSvg}
                emptyClassName={styles.chartEmpty}
                gridClassName={styles.chartGrid}
                lineClassName={styles.chartLine}
                pointClassName={styles.chartPoint}
                yTextClassName={styles.chartYText}
                xTextClassName={styles.chartXText}
              />
            </div>
          </div>

          <div className={styles.divider} />

          <div>
            <div className={styles.sectionTitle}>
              일일 권장 섭취 목표{' '}
              <span className={styles.sectionSubTitle}>
                (인바디 기준)
              </span>
            </div>

            <div className={styles.sectionDesc}>
              체중·골격근량·기초대사량과 목표·활동량 기반으로
              계산돼요.
            </div>

            {targetData?.outdated && (
              <p className={styles.outdatedNotice}>
                인바디나 프로필이 바뀌어 목표 영양치가
                오래되었습니다. 건강 데이터에서 다시 저장하면
                갱신됩니다.
              </p>
            )}

            <div className={styles.targetGrid}>
              <div className={styles.targetCard}>
                <div className={styles.targetLabel}>
                  목표 칼로리
                </div>

                <div className={styles.targetValue}>
                  {isLoading || calories === null
                    ? '-'
                    : calories.toLocaleString()}
                  <span className={styles.targetUnit}>
                    kcal
                  </span>
                </div>
              </div>

              <div className={styles.targetCard}>
                <div className={styles.targetLabel}>
                  목표 단백질
                </div>

                <div className={styles.targetValue}>
                  {isLoading || protein === null
                    ? '-'
                    : protein}
                  <span className={styles.targetUnit}>
                    g
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.badgeGroup}>
              {(diseases.includes('HYPERTENSION') ||
                diseases.includes('HYPERLIPIDEMIA')) && (
                <span className={styles.tagBadge}>
                  나트륨 주의
                </span>
              )}

              {diseases.includes(
                'GASTROESOPHAGEAL_REFLUX',
              ) && (
                <span className={styles.tagBadge}>
                  역류성식도염 주의
                </span>
              )}

              {diseases.length === 0 && (
                <span className={styles.tagBadge}>
                  건강 데이터 입력 필요
                </span>
              )}
            </div>
          </div>

          <div className={styles.divider} />

          <div>
            <div className={styles.sectionTitle}>
              요약 리포트
            </div>

            <ul className={styles.reportList}>
              <li className={styles.reportItem}>
                단백질 목표{' '}
                {protein === null ? '-' : protein}
                g/일 필요
              </li>

              <li className={styles.reportItem}>
                {goal} · {activityLevel}
              </li>

              <li className={styles.reportItem}>
                주의 질환: {diseaseText}
              </li>
            </ul>

            <button
              type="button"
              className={styles.reportBtn}
              onClick={() => navigate('/ai-report')}
            >
              AI 영양 리포트 자세히 보기
            </button>
          </div>
        </aside>

        <main className={styles.rightBoard}>
          <div className={styles.recommendHeader}>
            MYONGJI UNIV. RECOMMENDATIONS
          </div>

          <div className={styles.filterList}>
            {HOME_FILTERS.map((filter) => (
              <button
                key={filter.label}
                type="button"
                className={`${styles.filterChip} ${
                  selectedFilter === filter.label
                    ? styles.filterChipActive
                    : ''
                }`}
                onClick={() => setSelectedFilter(filter.label)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className={styles.filterDivider} />

          <div className={styles.adBanner}>
            <div className={styles.adLeft}>
              <span className={styles.adBadge}>광고</span>
              <div className={styles.adImagePlaceholder} />
              <span className={styles.adTitle}>
                지금 명지대학교 학생 인증하고 5% 쿠폰 받으세요!
              </span>
            </div>

            <button
              type="button"
              className={styles.adBtn}
            >
              보러가기 &gt;
            </button>
          </div>

          <div className={styles.foodList}>
            {isRecommendLoading && (
              <p className={styles.foodStatus}>
                추천 메뉴를 불러오는 중입니다.
              </p>
            )}

            {!isRecommendLoading && recommendError && (
              <p className={styles.foodStatus}>
                {recommendError}
              </p>
            )}

            {!isRecommendLoading &&
              !recommendError &&
              recommendations.length === 0 && (
                <p className={styles.foodStatus}>
                  조건에 맞는 추천 메뉴가 없습니다.
                </p>
              )}

            {!isRecommendLoading &&
              !recommendError &&
              recommendations.map((item) => {
                const menuName =
                  item.menus[0]?.menu.menuName ??
                  item.restaurant.name

                return (
                  <div
                    key={item.restaurant.restaurantId}
                    className={styles.foodCard}
                  >
                    <div className={styles.foodAccentBar} />

                    <div className={styles.foodContent}>
                      <div className={styles.foodTitle}>
                        {menuName}
                      </div>

                      <span className={styles.foodTag}>
                        {selectedFilter}
                      </span>

                      <div className={styles.foodNutriText}>
                        {formatHomeDetail(item, protein)}
                      </div>

                      <div className={styles.restaurantText}>
                        {formatHomeRestaurant(item)}
                        <span
                          className={styles.priceHighlight}
                        >
                          {formatHomePrice(item)}
                        </span>
                      </div>
                    </div>

                    <div className={styles.matchRightBox}>
                      <div className={styles.matchSquare}>
                        <span className={styles.matchNum}>
                          {formatMatchRate(item.topMatchRate)}
                        </span>

                        <span className={styles.matchLabel}>
                          MATCH
                        </span>
                      </div>

                      <button
                        type="button"
                        className={styles.mapActionBtn}
                        onClick={() =>
                          navigate(
                            `/map?restaurantId=${item.restaurant.restaurantId}`,
                          )
                        }
                      >
                        <img
                          src={mapIcon}
                          alt="지도"
                          className={styles.mapIcon}
                        />

                        <span>지도에서 보기</span>
                      </button>
                    </div>
                  </div>
                )
              })}
          </div>
        </main>
      </div>
    </div>
  )
}

export default HomePage