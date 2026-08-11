import { useState } from 'react'
import styles from './AiReportPage.module.css'

export function AiReportPage() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.titleSection}>
          <h1 className={styles.pageTitle}>AI영양소 분석 리포트</h1>
          <p className={styles.pageDesc}>
            AI가 인바디 데이터를 바탕으로 하루 권장 섭취 목표를 계산하고, 목표·활동량과 기저질환을 고려해 주의할 점을 알려드립니다.
            새 인바디를 업로드하면 목표치가 갱신돼요.
          </p>
        </div>

        <div className={styles.mainBoard}>
          {/* AI 분석 요약 박스 */}
          <div className={styles.summaryBanner}>
            <div className={styles.bannerInner}>
              <div className={styles.bannerTitle}>AI 분석 요약</div>
              <p className={styles.bannerContent}>
                <strong>김명지</strong>님은 <strong>골격근량(00.0kg)</strong> 유지를 위해 하루 약 <strong>000g의 단백질</strong>이 필요해요.
                <br />
                오늘은 단백질 함량이 높은 메뉴 위주로 추천드리고, 역류성 식도염과 나트륨 관리를 위해 자극적이지 않은 저염 메뉴 위주로 구성했습니다.
              </p>
            </div>
          </div>

          <div className={styles.priorityGrid}>
            <div className={styles.priorityCard}>
              <div className={styles.priorityHeader}>우선순위 1 — 인바디 기반</div>
              <div className={styles.tag}>단백질</div>
              <p className={styles.priorityDesc}>
                골격근량(00.0kg) 유지를 위해 하루 약 000g의 단백질이 필요해요. 평소 단백질 섭취를 늘려보세요.
              </p>
            </div>

            <div className={styles.priorityCard}>
              <div className={styles.priorityHeader}>우선순위 2 — 기저질환 기반</div>
              <div className={styles.tag}>식이섬유</div>
              <p className={styles.priorityDesc}>
                역류성 식도염 관리를 위해 자극적이지 않은 채소·잡곡류 위주 섭취를 권장해요.
              </p>
            </div>

            <div className={styles.priorityCard}>
              <div className={styles.priorityHeader}>우선순위 3 — 기저질환 기반</div>
              <div className={styles.tag}>나트륨 제한</div>
              <p className={styles.priorityDesc}>
                역류성 식도염이 있어 나트륨 섭취를 제한하는 것이 좋아요. 저염 메뉴 위주로 구성을 권장해요.
              </p>
            </div>
          </div>

          <div className={styles.contentRow}>
            <div className={styles.intakeCard}>
              <div className={styles.intakeTopGroup}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>일일 권장 섭취 목표</h3>
                  <p className={styles.cardDesc}>
                    인바디의 체중·골격근량·기초대사량을 기반으로 계산된 목표치예요.
                    <br />
                    실제 섭취량이 아니라 하루에 필요한 양을 의미해요.
                  </p>
                </div>

                <div className={styles.macroGrid}>
                  <div className={styles.macroBox}>
                    <span className={styles.macroLabel}>목표 칼로리</span>
                    <div className={styles.macroValueWrapper}>
                      <span className={styles.macroValueBig}>0,000</span>
                      <span className={styles.macroUnit}>kcal</span>
                    </div>
                  </div>

                  <div className={styles.macroBox}>
                    <span className={styles.macroLabel}>목표 단백질</span>
                    <div className={styles.macroValueWrapper}>
                      <span className={styles.macroValueBig}>000</span>
                      <span className={styles.macroUnit}>g</span>
                    </div>
                  </div>

                  <div className={styles.macroBox}>
                    <span className={styles.macroLabel}>목표 탄수화물</span>
                    <div className={styles.macroValueWrapper}>
                      <span className={styles.macroValueBig}>000</span>
                      <span className={styles.macroUnit}>g</span>
                    </div>
                  </div>

                  <div className={styles.macroBox}>
                    <span className={styles.macroLabel}>목표 지방</span>
                    <div className={styles.macroValueWrapper}>
                      <span className={styles.macroValueBig}>00</span>
                      <span className={styles.macroUnit}>g</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.cardFooterText}>
                나트륨·식이섬유는 기저질환 정보를 바탕으로 저염·고섬유 메뉴 권장 형태로 안내됩니다.
              </div>
            </div>

            <div className={styles.historyCard}>
              <div>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>분석 히스토리</h3>
                  <p className={styles.cardDesc}>새 인바디를 업로드할 때마다 점수와 목표치가 갱신돼요.</p>
                </div>

                <div className={styles.chartArea}>
                  <svg className={styles.chartSvg} viewBox="0 0 320 120">
                    <polyline
                      fill="none"
                      stroke="#00D4AC"
                      strokeWidth="2"
                      points="20,80 80,60 140,85 200,40 260,75"
                    />
                    <circle cx="20" cy="80" r="3" fill="#00D4AC" />
                    <circle cx="80" cy="60" r="3" fill="#00D4AC" />
                    <circle cx="140" cy="85" r="3" fill="#00D4AC" />
                    <circle cx="200" cy="40" r="3" fill="#00D4AC" />
                    <circle cx="260" cy="75" r="3" fill="#00D4AC" />
                  </svg>
                  <div className={styles.chartLabels}>
                    <span>6/4</span>
                    <span>6/25</span>
                    <span>7/18</span>
                    <span>7/25</span>
                    <span>8/5</span>
                  </div>
                </div>

                <div className={styles.historyList}>
                  <div className={styles.historyRow}>
                    <span className={styles.historyText}>측정 00/00 · 업로드 00/00 · 단백질 목표 000g/일</span>
                    <span className={styles.historyScoreActive}>현재 · 78점</span>
                  </div>
                  <div className={styles.historyRow}>
                    <span className={styles.historyText}>측정 00/00 · 업로드 00/00 · 단백질 목표 000g/일</span>
                    <span className={styles.historyScore}>74점</span>
                  </div>
                  <div className={styles.historyRow}>
                    <span className={styles.historyText}>측정 00/00 · 업로드 00/00 · 단백질 목표 000g/일</span>
                    <span className={styles.historyScore}>68점</span>
                  </div>
                  <div className={styles.historyRow}>
                    <span className={styles.historyText}>측정 00/00 · 업로드 00/00 · 단백질 목표 000g/일</span>
                    <span className={styles.historyScore}>62점</span>
                  </div>
                  {isHistoryOpen && (
                    <div className={styles.historyRow}>
                      <span className={styles.historyText}>측정 00/00 · 업로드 00/00 · 단백질 목표 000g/일</span>
                      <span className={styles.historyScore}>55점</span>
                    </div>
                  )}
                </div>

                <div className={styles.toggleBtnWrapper}>
                  <button
                    type="button"
                    className={styles.toggleBtn}
                    onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                  >
                    {isHistoryOpen ? '닫기 ▲' : '더보기 ▼'}
                  </button>
                </div>
              </div>

              <button type="button" className={styles.recommendBtn}>
                이 분석 기반 추천 메뉴 보러가기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AiReportPage