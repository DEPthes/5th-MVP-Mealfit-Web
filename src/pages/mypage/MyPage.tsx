import { type FormEvent, useEffect, useState } from 'react'
import {
  getInbodyHistory,
  type InbodyHistoryItem,
} from '@/api/inbody'
import {
  getMyProfile,
  type MemberProfile,
  updateMyProfile,
} from '@/api/member'
import {
  getRecommendations,
  type RecommendationItem,
} from '@/api/recommendation'
import type { ActivityLevel, Disease, Goal } from '@/api/types'
import { updateStoredNickname } from '@/utils/authSession'
import styles from './MyPage.module.css'

const activityLabels: Record<ActivityLevel, string> = {
  SEDENTARY: '주 0~0회 · 보통 강도',
  LIGHT: '주 1~2회',
  MODERATE: '주 3~4회',
  ACTIVE: '주 5~6회',
}

const goalLabels: Record<Goal, string> = {
  LOSS: '체중 감량',
  MAINTAIN: '체중 유지',
  GAIN: '근육량 증가 +0kg',
}

const diseaseOptions: ReadonlyArray<{
  value: Disease
  label: string
}> = [
  { value: 'GASTROESOPHAGEAL_REFLUX', label: '역류성 식도염' },
  { value: 'HYPERTENSION', label: '고혈압' },
  { value: 'DIABETES', label: '당뇨' },
  { value: 'HYPERLIPIDEMIA', label: '고지혈증' },
]

// 날짜 포맷 변환 함수 (YYYY.MM.DD)
const formatDate = (dateString?: string) => {
  if (!dateString) return '2026.00.00'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

export function MyPage() {
  const [profile, setProfile] = useState<MemberProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [nickname, setNickname] = useState('')
  const [height, setHeight] = useState('')
  const [activityLevel, setActivityLevel] =
    useState<ActivityLevel>('SEDENTARY')
  const [goal, setGoal] = useState<Goal>('MAINTAIN')
  const [diseases, setDiseases] = useState<Disease[]>([])
  const [inbodyHistory, setInbodyHistory] = useState<InbodyHistoryItem[]>([])
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([])

  const applyProfile = (member: MemberProfile) => {
    setProfile(member)
    setNickname(member.nickname)
    setHeight(member.height?.toString() ?? '')
    setActivityLevel(member.activityLevel)
    setGoal(member.goal)
    setDiseases(member.diseases)
  }

  const fetchProfile = async () => {
    const response = await getMyProfile()

    if (!response.success || !response.data) {
      throw new Error(response.message || '프로필을 불러오지 못했습니다.')
    }

    applyProfile(response.data)
    return response.data
  }

  useEffect(() => {
    let ignore = false

    const loadData = async () => {
      setIsLoading(true)

      try {
        const response = await getMyProfile()

        if (!response.success || !response.data) {
          throw new Error(response.message || '프로필을 불러오지 못했습니다.')
        }

        if (!ignore) {
          applyProfile(response.data)
        }

        try {
          const historyResponse = await getInbodyHistory()
          if (!ignore && historyResponse.success && historyResponse.data) {
            setInbodyHistory(historyResponse.data)
          }
        } catch {
          if (!ignore) setInbodyHistory([])
        }

        try {
          const recResponse = await getRecommendations()
          if (!ignore && recResponse.success && recResponse.data?.content) {
            setRecommendations(recResponse.data.content)
          }
        } catch {
          if (!ignore) setRecommendations([])
        }
      } catch (error) {
        if (!ignore) {
          setMessage(
            error instanceof Error
              ? error.message
              : '프로필을 불러오지 못했습니다.',
          )
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    void loadData()

    return () => {
      ignore = true
    }
  }, [])

  const handleDiseaseChange = (disease: Disease) => {
    setDiseases((current) =>
      current.includes(disease)
        ? current.filter((item) => item !== disease)
        : [...current, disease],
    )
  }

  const handleCancel = () => {
    if (profile) {
      applyProfile(profile)
    }
    setMessage('')
    setIsEditing(false)
  }

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')

    const trimmedNickname = nickname.trim()
    const parsedHeight = height ? Number(height) : undefined

    if (!trimmedNickname) {
      setMessage('닉네임을 입력해 주세요.')
      return
    }

    if (parsedHeight !== undefined && parsedHeight <= 0) {
      setMessage('키는 양수로 입력해 주세요.')
      return
    }

    setIsSaving(true)

    try {
      const response = await updateMyProfile({
        nickname: trimmedNickname,
        height: parsedHeight,
        activityLevel,
        goal,
        diseases,
      })

      if (!response.success) {
        throw new Error(response.message || '프로필 수정에 실패했습니다.')
      }

      const updatedProfile = await fetchProfile()
      updateStoredNickname(updatedProfile.nickname)
      setMessage('프로필이 수정되었습니다.')
      setIsEditing(false)
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : '프로필 수정에 실패했습니다.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <p className={styles.status}>프로필을 불러오는 중입니다.</p>
  }

  if (!profile) {
    return (
      <p className={`${styles.status} ${styles.error}`} role="alert">
        {message || '프로필을 불러오지 못했습니다.'}
      </p>
    )
  }

  const diseaseText =
    profile.diseases.length > 0
      ? profile.diseases
          .map(
            (disease) =>
              diseaseOptions.find((option) => option.value === disease)
                ?.label ?? disease,
          )
          .join(', ')
      : '없음'

  const latestInbodyScore =
    inbodyHistory.length > 0 && inbodyHistory[0].inbodyScore != null
      ? `${inbodyHistory[0].inbodyScore}점`
      : '00점'

  const recentInbodyDate =
    inbodyHistory.length > 0
      ? formatDate(inbodyHistory[0].measuredAt)
      : '-'

  const joinedDate = formatDate((profile as { createdAt?: string }).createdAt)

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          <div className={styles.titleSection}>
            <h1 className={styles.pageTitle}>마이페이지</h1>
            <p className={styles.pageDesc}>
              회원정보, 건강 스펙, 추천 이력을 조회하고 수정할 수 있습니다.
            </p>
          </div>

          <div className={styles.profileHeader}>
            <div className={styles.profileInfo}>
              <div className={styles.avatar}>
                {profile.nickname.charAt(0)}
              </div>
              <div className={styles.userInfo}>
                <h2 className={styles.userName}>{profile.nickname}</h2>
                <span className={styles.userEmail}>{profile.email}</span>
              </div>
            </div>
            <button
              type="button"
              className={styles.editProfileBtn}
              onClick={() => {
                setMessage('')
                setIsEditing(true)
              }}
            >
              정보 수정
            </button>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <div className={styles.statValue}>{latestInbodyScore}</div>
              <div className={styles.statLabel}>인바디 점수</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statValue}>{inbodyHistory.length}</div>
              <div className={styles.statLabel}>인바디 업로드</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statValue}>{joinedDate}</div>
              <div className={styles.statLabel}>가입일</div>
            </div>
          </div>

          <div className={styles.historyCard}>
            <h3 className={styles.cardTitle}>추천 이력</h3>
            {recommendations.length === 0 ? (
              <p className={styles.emptyText}>추천 이력이 없습니다.</p>
            ) : (
              <ul className={styles.historyList}>
                {recommendations.map((item, index) => {
                  // 안전한 속성 접근 처리
                  const menuItem = item.menus?.[0] as any
                  const restaurantItem = item.restaurant as any

                  const menuName =
                    menuItem?.menu?.name ||
                    menuItem?.menu?.menuName ||
                    restaurantItem?.name ||
                    '추천 메뉴'

                  const itemId =
                    restaurantItem?.id ||
                    restaurantItem?.restaurantId ||
                    index

                  return (
                    <li key={itemId} className={styles.historyItem}>
                      <div className={styles.historyName}>
                        <span className={styles.historyNum}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span>{menuName}</span>
                      </div>
                      <button type="button" className={styles.detailBtn}>
                        상세보기
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.healthSummaryCard}>
            <h3 className={styles.cardTitle}>건강 데이터 요약</h3>

            {isEditing ? (
              <form className={styles.editForm} onSubmit={handleSave}>
                <div className={styles.formRow}>
                  <label className={styles.formGroup}>
                    <span className={styles.infoLabel}>닉네임</span>
                    <input
                      className={styles.input}
                      value={nickname}
                      onChange={(event) => setNickname(event.target.value)}
                      required
                    />
                  </label>
                  <label className={styles.formGroup}>
                    <span className={styles.infoLabel}>키 (cm)</span>
                    <input
                      className={styles.input}
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={height}
                      onChange={(event) => setHeight(event.target.value)}
                    />
                  </label>
                </div>

                <div className={styles.formRow}>
                  <label className={styles.formGroup}>
                    <span className={styles.infoLabel}>활동량</span>
                    <select
                      className={styles.input}
                      value={activityLevel}
                      onChange={(event) =>
                        setActivityLevel(
                          event.target.value as ActivityLevel,
                        )
                      }
                    >
                      {Object.entries(activityLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={styles.formGroup}>
                    <span className={styles.infoLabel}>목표</span>
                    <select
                      className={styles.input}
                      value={goal}
                      onChange={(event) =>
                        setGoal(event.target.value as Goal)
                      }
                    >
                      {Object.entries(goalLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <fieldset className={styles.diseaseFieldset}>
                  <legend className={styles.infoLabel}>기저질환</legend>
                  <div className={styles.diseaseOptions}>
                    {diseaseOptions.map((option) => (
                      <label key={option.value} className={styles.checkbox}>
                        <input
                          type="checkbox"
                          checked={diseases.includes(option.value)}
                          onChange={() => handleDiseaseChange(option.value)}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                {message && (
                  <p className={styles.formMessage} role="alert">
                    {message}
                  </p>
                )}

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={isSaving}
                  >
                    {isSaving ? '저장 중...' : '저장'}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className={styles.infoList}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>최근 인바디 업로드</span>
                    <span className={styles.infoValue}>{recentInbodyDate}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>목표</span>
                    <span className={styles.infoValue}>
                      {goalLabels[profile.goal]}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>활동량</span>
                    <span className={styles.infoValue}>
                      {activityLabels[profile.activityLevel]}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>기저질환</span>
                    <span className={styles.infoValue}>{diseaseText}</span>
                  </div>
                </div>
                {message && <p className={styles.successMessage}>{message}</p>}
                <button
                  type="button"
                  className={styles.outlineBtn}
                  onClick={() => {
                    setMessage('')
                    setIsEditing(true)
                  }}
                >
                  수정하기
                </button>
              </>
            )}
          </div>

          <div className={styles.inbodyHistoryCard}>
            <h3 className={styles.cardTitle}>인바디 업로드 이력</h3>
            {inbodyHistory.length === 0 ? (
              <p className={styles.emptyText}>
                업로드한 인바디 이력이 없습니다.
              </p>
            ) : (
              <div className={styles.fileList}>
                {inbodyHistory.map((item) => (
                  <div key={item.inbodyId} className={styles.fileRow}>
                    <span className={styles.fileName}>
                      {item.originalFilename}
                    </span>
                    <span className={styles.fileStatus}>인식완료</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPage