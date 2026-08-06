import { useState } from 'react'
import styles from './HomePage.module.css'
import mapIcon from '@/assets/icons/map.svg'
import uploadIcon from '@/assets/icons/share.svg'

export function HomePage() {
  const [selectedFilter, setSelectedFilter] = useState('1만원 이하')

  const [inbodyScores] = useState([
    { date: '6/4', score: 20 },
    { date: '6/25', score: 30 },
    { date: '7/18', score: 20 },
    { date: '7/25', score: 45 },
    { date: '8/5', score: 32 },
  ])

  const filters = ['1만원 이하', '역류성식도염 안전', '고단백', '저지방', '저탄수', '고탄수', '저나트륨']

  const foods = [
    {
      id: 1,
      name: '보쌈정식',
      tag: '고단백',
      detail: '단백질 00g · 하루 목표(000g)의 00% 충족 · 100g당 단백질 00g',
      restaurant: '한솔 식당 · 명지대 정류장 기준 000 m',
      price: '00,000원 · 도보 0분',
      match: '00%',
    },
    {
      id: 2,
      name: '연어덮밥',
      tag: '고단백',
      detail: '단백질 00g · 하루 목표(000g)의 00% 충족 · 100g당 단백질 00g',
      restaurant: '한솔 식당 · 명지대 정류장 기준 000 m',
      price: '00,000원 · 도보 0분',
      match: '00%',
    },
    {
      id: 3,
      name: '닭가슴살 샐러드볼',
      tag: '고단백',
      detail: '단백질 00g · 하루 목표(000g)의 00% 충족 · 100g당 단백질 00g',
      restaurant: '한솔 식당 · 명지대 정류장 기준 000 m',
      price: '8,500원 · 도보 5분',
      match: '00%',
    },
    {
      id: 4,
      name: '순두부찌개',
      tag: '저나트륨',
      detail: '단백질 00g · 하루 목표(000g)의 00% 충족 · 100g당 단백질 00g',
      restaurant: '한솔 식당 · 명지대 정류장 기준 000 m',
      price: '10,000원 · 도보 10분',
      match: '00%',
    },
    {
      id: 5,
      name: '순두부찌개',
      tag: '저나트륨',
      detail: '단백질 00g · 하루 목표(000g)의 00% 충족 · 100g당 단백질 00g',
      restaurant: '한솔 식당 · 명지대 정류장 기준 000 m',
      price: '10,000원 · 도보 10분',
      match: '00%',
    },
  ]

  return (
    <div className={styles.pageWrapper}>
      <h1 className={styles.pageTitle}>홈 - 내 헬스 스펙 & 나만의 추천메뉴</h1>

      <div className={styles.contentContainer}>
        <aside className={styles.leftBoard}>
          <div className={styles.boardHeader}>
            <span className={styles.boardTitle}>MY HEALTH SPEC BOARD</span>
          </div>

          <div className={styles.inbodyNoticeCard}>
            <p className={styles.inbodyText}>
              인바디 업로드한 지 <strong>00일</strong> 지났어요.
              <br />
              새로 업로드하면 더 정확해져요.
            </p>
            <button type="button" className={styles.uploadBtn}>
              업로드
              <img src={uploadIcon} alt="" className={styles.uploadIcon} />
            </button>
          </div>

          <div className={styles.divider} />

          <div>
            <div className={styles.sectionTitle}>
              인바디 점수 추이 <span className={styles.sectionSubTitle}>(최근 0회)</span>
            </div>

            <div className={styles.graphBox}>
              <svg className={styles.chartSvg} viewBox="0 0 320 140">
                <line x1="30" y1="20" x2="310" y2="20" className={styles.chartGrid} />
                <text x="5" y="24" className={styles.chartYText}>70</text>

                <line x1="30" y1="50" x2="310" y2="50" className={styles.chartGrid} />
                <text x="5" y="54" className={styles.chartYText}>50</text>

                <line x1="30" y1="80" x2="310" y2="80" className={styles.chartGrid} />
                <text x="5" y="84" className={styles.chartYText}>30</text>

                <line x1="30" y1="110" x2="310" y2="110" className={styles.chartGrid} />
                <text x="5" y="114" className={styles.chartYText}>10</text>

                <polyline
                  points="50,95 110,80 170,95 230,58 290,78"
                  className={styles.chartLine}
                />

                {inbodyScores.map((item, idx) => {
                  const xPos = 50 + idx * 60
                  return (
                    <g key={item.date}>
                      <circle
                        cx={xPos}
                        cy={idx === 0 ? 95 : idx === 1 ? 80 : idx === 2 ? 95 : idx === 3 ? 58 : 78}
                        r="4"
                        className={styles.chartPoint}
                      />
                      <text x={xPos - 10} y="132" className={styles.chartXText}>
                        {item.date}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>

          <div className={styles.divider} />

          <div>
            <div className={styles.sectionTitle}>
              일일 권장 섭취 목표 <span className={styles.sectionSubTitle}>(인바디 기준)</span>
            </div>
            <div className={styles.sectionDesc}>
              체중·골격근량·기초대사량과 목표·활동량 기반으로 계산돼요.
            </div>

            <div className={styles.targetGrid}>
              <div className={styles.targetCard}>
                <div className={styles.targetLabel}>목표 칼로리</div>
                <div className={styles.targetValue}>
                  1,000<span className={styles.targetUnit}>kcal</span>
                </div>
              </div>
              <div className={styles.targetCard}>
                <div className={styles.targetLabel}>목표 단백질</div>
                <div className={styles.targetValue}>
                  000<span className={styles.targetUnit}>g</span>
                </div>
              </div>
            </div>

            <div className={styles.badgeGroup}>
              <span className={styles.tagBadge}>나트륨 주의</span>
              <span className={styles.tagBadge}>식이섬유 늘리기</span>
            </div>
          </div>

          <div className={styles.divider} />

          <div>
            <div className={styles.sectionTitle}>요약 리포트</div>
            <ul className={styles.reportList}>
              <li className={styles.reportItem}>단백질 목표 000g/일 필요</li>
              <li className={styles.reportItem}>근육량 증가 +0kg · 주 0~0 회</li>
              <li className={styles.reportItem}>주의 질환: 역류성 식도염</li>
            </ul>
            <button type="button" className={styles.reportBtn}>
              AI 영양 리포트 자세히 보기
            </button>
          </div>
        </aside>

        <main className={styles.rightBoard}>
          <div className={styles.recommendHeader}>MYONGJI UNIV. RECOMMENDATIONS</div>

          <div className={styles.filterList}>
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`${styles.filterChip} ${
                  selectedFilter === filter ? styles.filterChipActive : ''
                }`}
                onClick={() => setSelectedFilter(filter)}
              >
                {filter}
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
            <button type="button" className={styles.adBtn}>
              보러가기 &gt;
            </button>
          </div>

          <div className={styles.foodList}>
            {foods.map((food) => (
              <div key={food.id} className={styles.foodCard}>
                <div className={styles.foodAccentBar} />
                <div className={styles.foodContent}>
                  <div className={styles.foodTitle}>{food.name}</div>
                  <span className={styles.foodTag}>{food.tag}</span>
                  <div className={styles.foodNutriText}>{food.detail}</div>
                  <div className={styles.restaurantText}>
                    {food.restaurant}
                    <span className={styles.priceHighlight}>{food.price}</span>
                  </div>
                </div>

                <div className={styles.matchRightBox}>
                  <div className={styles.matchSquare}>
                    <span className={styles.matchNum}>{food.match}</span>
                    <span className={styles.matchLabel}>MATCH</span>
                  </div>
                  <button type="button" className={styles.mapActionBtn}>
                    <img src={mapIcon} alt="지도" className={styles.mapIcon} />
                    <span>지도에서 보기</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

export default HomePage