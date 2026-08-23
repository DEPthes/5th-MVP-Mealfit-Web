import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import styles from './HealthDataPage.module.css'

import {
  getLatestInbody,
  uploadInbody,
  type InbodyResponse,
} from '@/api/inbody'
import {
  calculateTargets,
  getMyTargets,
  type TargetResponse,
} from '@/api/analysis'
import {
  getMyProfile,
  updateMyProfile,
  type MemberProfile,
} from '@/api/member'
import type { ActivityLevel, Disease, Goal } from '@/api/types'

const GOAL_OPTIONS = [
  { label: '체중 감량', value: 'LOSS' as Goal },
  { label: '체중 유지', value: 'MAINTAIN' as Goal },
  { label: '근육량 증가', value: 'GAIN' as Goal },
]

const FREQUENCY_OPTIONS = [
  { label: '없음', value: 'SEDENTARY' as ActivityLevel },
  { label: '주 1~2회', value: 'LIGHT' as ActivityLevel },
  { label: '주 3~4회', value: 'MODERATE' as ActivityLevel },
  { label: '주 5~6회', value: 'ACTIVE' as ActivityLevel },
]

const INTENSITY_OPTIONS = ['낮음', '보통', '높음']

const DISEASE_OPTIONS: {
  label: string
  value: Disease
}[] = [
  { label: '역류성 식도염', value: 'GASTROESOPHAGEAL_REFLUX' },
  { label: '고혈압', value: 'HYPERTENSION' },
  { label: '당뇨', value: 'DIABETES' },
  { label: '고지혈증', value: 'HYPERLIPIDEMIA' },
]

const goalLabel = (goal: Goal) =>
  GOAL_OPTIONS.find((option) => option.value === goal)?.label ?? goal

const frequencyLabel = (level: ActivityLevel) =>
  FREQUENCY_OPTIONS.find((option) => option.value === level)?.label ?? level

export function HealthDataPage() {
  const [inbodyOpen, setInbodyOpen] = useState(true)
  const [calorieOpen, setCalorieOpen] = useState(true)

  const [selectedGoal, setSelectedGoal] = useState<Goal>('MAINTAIN')
  const [selectedFreq, setSelectedFreq] =
    useState<ActivityLevel>('LIGHT')
  const [selectedIntensity, setSelectedIntensity] = useState('보통')

  const [selectedDiseases, setSelectedDiseases] = useState<Disease[]>([])

  const [inbodyData, setInbodyData] = useState<InbodyResponse | null>(null)
  const [targetData, setTargetData] = useState<TargetResponse | null>(null)
  const [profile, setProfile] = useState<MemberProfile | null>(null)

  const [targetWeight, setTargetWeight] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchHealthData = async () => {
      setIsLoading(true)

      try {
        // 프로필이 없어도 인바디가 없을 수 있고,
        // 인바디가 없어도 프로필은 정상적으로 조회될 수 있으므로
        // 각각 독립적으로 요청한다.
        try {
          const profileResponse = await getMyProfile()

          if (profileResponse.data) {
            const member = profileResponse.data

            setProfile(member)
            setSelectedGoal(member.goal)
            setSelectedFreq(member.activityLevel)
            setSelectedDiseases(member.diseases ?? [])
          }
        } catch (error) {
          console.error('프로필 조회 실패:', error)
        }

        try {
          const inbodyResponse = await getLatestInbody()

          if (inbodyResponse.data) {
            setInbodyData(inbodyResponse.data)
          }
        } catch (error) {
          // 아직 인바디를 업로드하지 않은 경우에도 페이지는 정상 표시한다.
          console.info('최신 인바디가 없습니다.', error)
        }

        try {
          const targetResponse = await getMyTargets()

          if (targetResponse.data) {
            setTargetData(targetResponse.data)
          }
        } catch (error) {
          // 아직 목표 영양치가 산출되지 않은 경우에는 빈 상태로 둔다.
          console.info('저장된 목표 영양치가 없습니다.', error)
          setTargetData(null)
        }
      } finally {
        setIsLoading(false)
      }
    }

    void fetchHealthData()
  }, [])

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png']

    if (!allowedTypes.includes(file.type)) {
      setMessage('JPG, JPEG, PNG 파일만 업로드할 수 있습니다.')
      event.target.value = ''
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage('파일 크기는 최대 10MB까지 업로드할 수 있습니다.')
      event.target.value = ''
      return
    }

    setIsUploading(true)
    setMessage('인바디 파일을 업로드하고 있습니다...')

    try {
      const response = await uploadInbody(file)

      if (response.data) {
        setInbodyData(response.data)
        setMessage('인바디 결과를 성공적으로 인식했습니다.')
      }
    } catch (error) {
      console.error('인바디 업로드 실패:', error)
      setMessage(
        error instanceof Error
          ? error.message
          : '인바디 업로드에 실패했습니다.',
      )
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  const handleDiseaseChange = (disease: Disease) => {
    setSelectedDiseases((current) =>
      current.includes(disease)
        ? current.filter((item) => item !== disease)
        : [...current, disease],
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage('저장하고 목표 영양치를 계산하고 있습니다...')

    try {
      // 서버 명세에는 목표 체중과 운동 강도 필드가 없습니다.
      // 현재 UI의 운동 횟수를 서버의 ActivityLevel로 사용합니다.
      await updateMyProfile({
        goal: selectedGoal,
        activityLevel: selectedFreq,
        diseases: selectedDiseases,
      })

      const targetResponse = await calculateTargets()

      if (targetResponse.data) {
        setTargetData(targetResponse.data)
      }

      setMessage('건강 데이터가 저장되었습니다.')
    } catch (error) {
      console.error('건강 데이터 저장 실패:', error)
      setMessage(
        error instanceof Error
          ? error.message
          : '건강 데이터 저장에 실패했습니다.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const displayGoal = profile?.goal ?? selectedGoal

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.titleSection}>
          <h1 className={styles.pageTitle}>건강 데이터 입력</h1>
          <p className={styles.pageDesc}>
            인바디 결과를 업로드해 체성분 데이터를 자동으로 인식하고,
            목표·활동량과 기저질환 정보를 함께 입력해 주세요.
          </p>
        </div>

        {message && (
          <p role="status" style={{ marginBottom: 16 }}>
            {message}
          </p>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>01. 인바디 파일 업로드</h2>

          <div className={styles.cardContainer}>
            <div className={styles.uploadCard}>
              <h3 className={styles.cardSubTitle}>인바디 결과지 업로드</h3>

              <label className={styles.dropZone}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />

                <p className={styles.dropTextPrimary}>
                  {isUploading
                    ? '파일을 업로드하고 있습니다...'
                    : '파일을 클릭해서 업로드'}
                </p>

                <p className={styles.dropTextSecondary}>
                  JPG, PNG · 최대 10MB
                </p>
              </label>

              {inbodyData && (
                <div className={styles.uploadStatusRow}>
                  <span className={styles.statusText}>
                    인식 완료 — {inbodyData.measuredAt}
                  </span>

                  <button
                    type="button"
                    className={styles.reuploadBtn}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    다시 업로드
                  </button>
                </div>
              )}
            </div>

            <div className={styles.accordionBox}>
              <button
                type="button"
                className={styles.accordionHeader}
                onClick={() => setInbodyOpen(!inbodyOpen)}
              >
                <span>자동 인식 결과 보기</span>
                <span
                  className={`${styles.arrow} ${
                    inbodyOpen ? styles.open : ''
                  }`}
                >
                  ▲
                </span>
              </button>

              {inbodyOpen && (
                <div className={styles.accordionContent}>
                  <p className={styles.contentDesc}>
                    인식된 값이 아래에 반영되었습니다.
                  </p>

                  <div className={styles.dataGrid}>
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>체중</span>
                      <span className={styles.dataValue}>
                        {inbodyData?.weight ?? '-'} kg
                      </span>
                    </div>

                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>골격근량</span>
                      <span className={styles.dataValue}>
                        {inbodyData?.skeletalMuscleMass ?? '-'} kg
                      </span>
                    </div>

                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>체지방률</span>
                      <span className={styles.dataValue}>
                        {inbodyData?.bodyFatPercentage ?? '-'} %
                      </span>
                    </div>

                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>
                        기초대사량
                      </span>
                      <span className={styles.dataValue}>
                        {inbodyData?.bmr?.toLocaleString() ?? '-'} kcal
                      </span>
                    </div>

                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>
                        내장지방레벨
                      </span>
                      <span className={styles.dataValue}>
                        {inbodyData?.visceralFatLevel ?? '-'}
                      </span>
                    </div>

                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>
                        인바디 점수
                      </span>
                      <span className={styles.dataValue}>
                        {inbodyData?.inbodyScore ?? '-'} 점
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.accordionBox}>
              <button
                type="button"
                className={styles.accordionHeader}
                onClick={() => setCalorieOpen(!calorieOpen)}
              >
                <span>목표 칼로리 결과 보기</span>
                <span
                  className={`${styles.arrow} ${
                    calorieOpen ? styles.open : ''
                  }`}
                >
                  ▲
                </span>
              </button>

              {calorieOpen && (
                <div className={styles.accordionContent}>
                  <p className={styles.contentDesc}>
                    최신 인바디와 회원의 목표·활동량을 기준으로 서버에서
                    하루·한 끼 목표 영양치를 계산합니다.
                  </p>

                  <div className={styles.dataGrid}>
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>
                        기초대사량 (BMR)
                      </span>
                      <span className={styles.dataValue}>
                        {inbodyData?.bmr?.toLocaleString() ?? '-'} kcal
                      </span>
                    </div>

                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>
                        목표 칼로리
                      </span>
                      <span className={styles.dataValue}>
                        {targetData?.dailyTarget?.calories?.toLocaleString() ??
                          '-'}{' '}
                        kcal
                      </span>
                    </div>

                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>
                        목표 단백질
                      </span>
                      <span className={styles.dataValue}>
                        {targetData?.dailyTarget?.protein ?? '-'} g
                      </span>
                    </div>

                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>
                        목표 탄수화물
                      </span>
                      <span className={styles.dataValue}>
                        {targetData?.dailyTarget?.carbohydrate ?? '-'} g
                      </span>
                    </div>

                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>
                        목표 지방
                      </span>
                      <span className={styles.dataValue}>
                        {targetData?.dailyTarget?.fat ?? '-'} g
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>02. 목표 및 활동량 입력</h2>

          <div className={styles.cardContainer}>
            <div className={styles.formCard}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>목표</label>

                <div className={styles.btnGroup3}>
                  {GOAL_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`${styles.selectBtn} ${
                        selectedGoal === option.value ? styles.active : ''
                      }`}
                      onClick={() => setSelectedGoal(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  목표 체중 (kg)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="예: 60.0"
                  value={targetWeight}
                  onChange={(event) => setTargetWeight(event.target.value)}
                  className={styles.textInput}
                />

                <p style={{ marginTop: 8, fontSize: 12 }}>
                  현재 서버 API에는 목표 체중을 저장하는 필드가 없어
                  화면 입력값으로만 유지됩니다.
                </p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>평소 운동량</label>

                <div className={styles.btnGrid2x2}>
                  {FREQUENCY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`${styles.selectBtn} ${
                        selectedFreq === option.value
                          ? styles.active
                          : ''
                      }`}
                      onClick={() => setSelectedFreq(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>평소 운동 강도</label>

                <div className={styles.btnGroup3}>
                  {INTENSITY_OPTIONS.map((intensity) => (
                    <button
                      key={intensity}
                      type="button"
                      className={`${styles.selectBtn} ${
                        selectedIntensity === intensity
                          ? styles.active
                          : ''
                      }`}
                      onClick={() => setSelectedIntensity(intensity)}
                    >
                      {intensity}
                    </button>
                  ))}
                </div>

                <p style={{ marginTop: 8, fontSize: 12 }}>
                  서버 명세에는 운동 강도 전용 필드가 없어 현재는
                  저장하지 않습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            03. 기저질환 · 주의 건강 문제 입력
          </h2>

          <div className={styles.cardContainer}>
            <div className={styles.formCard}>
              <label className={styles.formLabel}>기저질환</label>

              <div className={styles.checkboxList}>
                {DISEASE_OPTIONS.map((disease) => (
                  <label
                    key={disease.value}
                    className={styles.checkboxRow}
                  >
                    <input
                      type="checkbox"
                      checked={selectedDiseases.includes(disease.value)}
                      onChange={() =>
                        handleDiseaseChange(disease.value)
                      }
                      className={styles.checkboxInput}
                    />

                    <span>{disease.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className={styles.bottomSummarySection}>
          <div className={styles.summaryTitle}>입력 요약</div>

          <div className={styles.badgeList}>
            <span className={styles.badge}>
              체지방률 {inbodyData?.bodyFatPercentage ?? '-'}%
            </span>

            <span className={styles.badge}>
              골격근량 {inbodyData?.skeletalMuscleMass ?? '-'}kg
            </span>

            <span className={styles.badge}>
              {goalLabel(displayGoal)}
            </span>

            <span className={styles.badge}>
              {frequencyLabel(selectedFreq)} · {selectedIntensity} 강도
            </span>

            {selectedDiseases.map((disease) => {
              const label =
                DISEASE_OPTIONS.find(
                  (option) => option.value === disease,
                )?.label ?? disease

              return (
                <span key={disease} className={styles.badge}>
                  {label}
                </span>
              )
            })}
          </div>

          <button
            type="button"
            className={styles.submitBtn}
            onClick={() => void handleSave()}
            disabled={isSaving || isLoading}
          >
            {isSaving
              ? '저장 중...'
              : '저장하고 스펙 보드 반영'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default HealthDataPage
