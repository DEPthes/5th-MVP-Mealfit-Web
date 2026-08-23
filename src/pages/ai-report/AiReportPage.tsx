import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getAiReport,
  getAnalysisHistory,
  getScoreHistory,
  type AiReportResponse,
  type AnalysisHistoryItem,
  type ScoreHistoryItem,
} from '@/api/analysis'
import { getMyProfile } from '@/api/member'
import { ScoreTrendChart } from '@/components/charts/ScoreTrendChart'
import { formatChartDate } from '@/utils/scoreChart'
import styles from './AiReportPage.module.css'

const diseaseLabels: Record<string, string> = {
  GASTROESOPHAGEAL_REFLUX: '역류성 식도염',
  HYPERTENSION: '고혈압',
  DIABETES: '당뇨',
  HYPERLIPIDEMIA: '고지혈증',
}

function formatMacro(value?: number | null) {
  if (value == null) {
    return '-'
  }

  return value.toLocaleString()
}

async function fetchHistory(expanded: boolean) {
  const [scoreResponse, historyResponse] = await Promise.all([
    getScoreHistory(expanded),
    getAnalysisHistory(expanded),
  ])

  return {
    scores: scoreResponse.data ?? [],
    history: historyResponse.data ?? [],
  }
}

function sortByMeasuredAtAsc<T extends { measuredAt: string }>(
  items: T[],
) {
  return [...items].sort((a, b) =>
    a.measuredAt.localeCompare(b.measuredAt),
  )
}

function sortByMeasuredAtDesc<T extends { measuredAt: string }>(
  items: T[],
) {
  return [...items].sort((a, b) =>
    b.measuredAt.localeCompare(a.measuredAt),
  )
}

function formatHistoryDate(value: string) {
  return formatChartDate(value.slice(0, 10))
}

function priorityBasis(relatedDiseases: string[]) {
  return relatedDiseases.length > 0 ? '기저질환 기반' : '인바디 기반'
}

export function AiReportPage() {
  const navigate = useNavigate()
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [nickname, setNickname] = useState('')
  const [report, setReport] = useState<AiReportResponse | null>(null)
  const [scoreHistory, setScoreHistory] = useState<ScoreHistoryItem[]>(
    [],
  )
  const [analysisHistory, setAnalysisHistory] = useState<
    AnalysisHistoryItem[]
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        try {
          const profileResponse = await getMyProfile()

          if (profileResponse.data) {
            setNickname(profileResponse.data.nickname)
          }
        } catch (error) {
          console.info('회원 정보 조회 실패:', error)
        }

        try {
          const reportResponse = await getAiReport()

          if (reportResponse.data) {
            setReport(reportResponse.data)
          }
        } catch (error) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'AI 영양 리포트를 불러오지 못했습니다.',
          )
        }

        try {
          const { scores, history } = await fetchHistory(false)
          setScoreHistory(sortByMeasuredAtAsc(scores))
          setAnalysisHistory(sortByMeasuredAtDesc(history))
        } catch (error) {
          console.info('분석 히스토리 조회 실패:', error)
        }
      } finally {
        setIsLoading(false)
      }
    }

    void fetchReport()
  }, [])

  const handleToggleHistory = async () => {
    const nextOpen = !isHistoryOpen

    setIsHistoryOpen(nextOpen)
    setIsHistoryLoading(true)

    try {
      const { scores, history } = await fetchHistory(nextOpen)
      setScoreHistory(sortByMeasuredAtAsc(scores))
      setAnalysisHistory(sortByMeasuredAtDesc(history))
    } catch (error) {
      console.info('분석 히스토리 조회 실패:', error)
    } finally {
      setIsHistoryLoading(false)
    }
  }

  const dailyTarget = report?.dailyTarget
  const deficiencies = report?.deficiencies ?? []

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
          {isLoading && (
            <p className={styles.statusText}>리포트를 불러오는 중입니다.</p>
          )}

          {!isLoading && (
            <>
              {errorMessage && (
                <p className={styles.statusText}>{errorMessage}</p>
              )}
              <div className={styles.summaryBanner}>
                <div className={styles.bannerInner}>
                  <div className={styles.bannerTitle}>AI 분석 요약</div>
                  <p className={styles.bannerContent}>
                    {report?.summary ? (
                      report.summary
                    ) : (
                      <>
                        {nickname || '회원'}님의 AI 영양 리포트가 아직
                        없습니다. 인바디를 업로드하면 요약이 생성됩니다.
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className={styles.priorityGrid}>
                {deficiencies.length === 0 ? (
                  <div className={styles.priorityCard}>
                    <div className={styles.priorityHeader}>
                      우선순위 — 분석 결과
                    </div>
                    <p className={styles.priorityDesc}>
                      아직 분석된 부족 영양소가 없습니다.
                    </p>
                  </div>
                ) : (
                  deficiencies.map((item) => (
                    <div
                      key={`${item.priority}-${item.issue}`}
                      className={styles.priorityCard}
                    >
                      <div className={styles.priorityHeader}>
                        우선순위 {item.priority} —{' '}
                        {priorityBasis(item.relatedDiseases)}
                      </div>
                      <div className={styles.tag}>{item.issue}</div>
                      <p className={styles.priorityDesc}>
                        {item.description}
                        {item.relatedDiseases.length > 0 && (
                          <>
                            {' '}
                            관련 질환:{' '}
                            {item.relatedDiseases
                              .map(
                                (disease) =>
                                  diseaseLabels[disease] ?? disease,
                              )
                              .join(', ')}
                          </>
                        )}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className={styles.contentRow}>
                <div className={styles.intakeCard}>
                  <div className={styles.intakeTopGroup}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>
                        일일 권장 섭취 목표
                      </h3>
                      <p className={styles.cardDesc}>
                        인바디의 체중·골격근량·기초대사량을 기반으로 계산된
                        목표치예요.
                        <br />
                        실제 섭취량이 아니라 하루에 필요한 양을 의미해요.
                      </p>
                    </div>

                    <div className={styles.macroGrid}>
                      <div className={styles.macroBox}>
                        <span className={styles.macroLabel}>
                          목표 칼로리
                        </span>
                        <div className={styles.macroValueWrapper}>
                          <span className={styles.macroValueBig}>
                            {formatMacro(dailyTarget?.calories)}
                          </span>
                          <span className={styles.macroUnit}>kcal</span>
                        </div>
                      </div>

                      <div className={styles.macroBox}>
                        <span className={styles.macroLabel}>
                          목표 단백질
                        </span>
                        <div className={styles.macroValueWrapper}>
                          <span className={styles.macroValueBig}>
                            {formatMacro(dailyTarget?.protein)}
                          </span>
                          <span className={styles.macroUnit}>g</span>
                        </div>
                      </div>

                      <div className={styles.macroBox}>
                        <span className={styles.macroLabel}>
                          목표 탄수화물
                        </span>
                        <div className={styles.macroValueWrapper}>
                          <span className={styles.macroValueBig}>
                            {formatMacro(dailyTarget?.carbohydrate)}
                          </span>
                          <span className={styles.macroUnit}>g</span>
                        </div>
                      </div>

                      <div className={styles.macroBox}>
                        <span className={styles.macroLabel}>
                          목표 지방
                        </span>
                        <div className={styles.macroValueWrapper}>
                          <span className={styles.macroValueBig}>
                            {formatMacro(dailyTarget?.fat)}
                          </span>
                          <span className={styles.macroUnit}>g</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardFooterText}>
                    나트륨·식이섬유는 기저질환 정보를 바탕으로 저염·고섬유
                    메뉴 권장 형태로 안내됩니다.
                  </div>
                </div>

                <div className={styles.historyCard}>
                  <div>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>분석 히스토리</h3>
                      <p className={styles.cardDesc}>
                        새 인바디를 업로드할 때마다 점수와 목표치가
                        갱신돼요.
                      </p>
                    </div>

                    <div className={styles.chartArea}>
                      <ScoreTrendChart
                        items={scoreHistory}
                        height={120}
                        showAxes={false}
                        className={styles.chartSvg}
                        emptyClassName={styles.chartEmpty}
                        lineClassName={styles.chartLine}
                        pointClassName={styles.chartPoint}
                      />
                      {scoreHistory.length > 0 && (
                        <div className={styles.chartLabels}>
                          {scoreHistory.map((item) => (
                            <span
                              key={`${item.measuredAt}-${item.inbodyScore}`}
                            >
                              {formatChartDate(item.measuredAt)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className={styles.historyList}>
                      {analysisHistory.length === 0 ? (
                        <p className={styles.statusText}>
                          분석 히스토리가 없습니다.
                        </p>
                      ) : (
                        analysisHistory.map((item, index) => (
                          <div
                            key={`${item.measuredAt}-${item.uploadedAt}`}
                            className={styles.historyRow}
                          >
                            <span className={styles.historyText}>
                              측정 {formatHistoryDate(item.measuredAt)} ·
                              업로드 {formatHistoryDate(item.uploadedAt)} ·
                              단백질 목표 {item.proteinTarget ?? '-'}g/일
                            </span>
                            <span
                              className={
                                index === 0
                                  ? styles.historyScoreActive
                                  : styles.historyScore
                              }
                            >
                              {index === 0 ? '현재 · ' : ''}
                              {item.inbodyScore}점
                            </span>
                          </div>
                        ))
                      )}
                    </div>

                    <div className={styles.toggleBtnWrapper}>
                      <button
                        type="button"
                        className={styles.toggleBtn}
                        onClick={() => {
                          void handleToggleHistory()
                        }}
                        disabled={isHistoryLoading}
                      >
                        {isHistoryOpen ? '닫기 ▲' : '더보기 ▼'}
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={styles.recommendBtn}
                    onClick={() => navigate('/map')}
                  >
                    이 분석 기반 추천 메뉴 보러가기
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AiReportPage
