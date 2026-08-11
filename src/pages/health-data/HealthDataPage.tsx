import { useState } from 'react'
import styles from './HealthDataPage.module.css'

export function HealthDataPage() {
  const [inbodyOpen, setInbodyOpen] = useState(true)
  const [calorieOpen, setCalorieOpen] = useState(true)
  const [selectedGoal, setSelectedGoal] = useState('체중 유지')
  const [selectedFreq, setSelectedFreq] = useState('주 1~2회')
  const [selectedIntensity, setSelectedIntensity] = useState('보통')

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.titleSection}>
          <h1 className={styles.pageTitle}>건강 데이터 입력</h1>
          <p className={styles.pageDesc}>
            인바디 결과를 업로드해 체성분 데이터를 자동으로 인식하고, 목표·활동량과 기저질환 정보를 함께 입력해 주세요.
          </p>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>01. 인바디 파일 업로드</h2>
          <div className={styles.cardContainer}>
            <div className={styles.uploadCard}>
              <h3 className={styles.cardSubTitle}>인바디 결과지 업로드</h3>
              <div className={styles.dropZone}>
                <p className={styles.dropTextPrimary}>파일을 드래그하거나 클릭해서 업로드</p>
                <p className={styles.dropTextSecondary}>JPG, PNG, PDF · 최대 10MB</p>
              </div>
              <div className={styles.uploadStatusRow}>
                <span className={styles.statusText}>인식 완료 — inbody_20260000 .pdf</span>
                <button type="button" className={styles.reuploadBtn}>다시 업로드</button>
              </div>
            </div>

            <div className={styles.accordionBox}>
              <button 
                type="button" 
                className={styles.accordionHeader}
                onClick={() => setInbodyOpen(!inbodyOpen)}
              >
                <span>자동 인식 결과 보기</span>
                <span className={`${styles.arrow} ${inbodyOpen ? styles.open : ''}`}>▲</span>
              </button>

              {inbodyOpen && (
                <div className={styles.accordionContent}>
                  <p className={styles.contentDesc}>인식된 값이 아래에 반영되었습니다.</p>
                  <div className={styles.dataGrid}>
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>체중</span>
                      <span className={styles.dataValue}>00.0 kg</span>
                    </div>
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>골격근량</span>
                      <span className={styles.dataValue}>00.0 kg</span>
                    </div>
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>체지방률</span>
                      <span className={styles.dataValue}>00.0 %</span>
                    </div>
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>기초대사량</span>
                      <span className={styles.dataValue}>0,000 kcal</span>
                    </div>
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>내장지방레벨</span>
                      <span className={styles.dataValue}>0</span>
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
                <span className={`${styles.arrow} ${calorieOpen ? styles.open : ''}`}>▲</span>
              </button>

              {calorieOpen && (
                <div className={styles.accordionContent}>
                  <p className={styles.contentDesc}>
                    기초대사량(BMR)에 운동량·강도를 반영한 활동대사량(TDEE)을 계산해, 목표에 맞는 하루 권장 칼로리·영양소 목표치를 산출합니다.
                  </p>
                  <div className={styles.dataGrid}>
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>기초대사량 (BMR)</span>
                      <span className={styles.dataValue}>0,000 kcal</span>
                    </div>
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>활동대사량 (TDEE)</span>
                      <span className={styles.dataValue}>0,000 kcal</span>
                    </div>
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>목표 칼로리</span>
                      <span className={styles.dataValue}>0,000 kcal</span>
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
                  {['체중 감량', '체중 유지', '근육량 증가'].map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      className={`${styles.selectBtn} ${selectedGoal === goal ? styles.active : ''}`}
                      onClick={() => setSelectedGoal(goal)}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>목표 체중 (kg)</label>
                <input 
                  type="text" 
                  placeholder="예: 00.0" 
                  className={styles.textInput} 
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>평소 운동량</label>
                <div className={styles.btnGrid2x2}>
                  {['없음', '주 1~2회', '주 3~4회', '주 5~6회'].map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      className={`${styles.selectBtn} ${selectedFreq === freq ? styles.active : ''}`}
                      onClick={() => setSelectedFreq(freq)}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>평소 운동 강도</label>
                <div className={styles.btnGroup3}>
                  {['낮음', '보통', '높음'].map((intensity) => (
                    <button
                      key={intensity}
                      type="button"
                      className={`${styles.selectBtn} ${selectedIntensity === intensity ? styles.active : ''}`}
                      onClick={() => setSelectedIntensity(intensity)}
                    >
                      {intensity}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>03. 기저질환 · 주의 건강 문제 입력</h2>
          <div className={styles.cardContainer}>
            <div className={styles.formCard}>
              <label className={styles.formLabel}>기저질환</label>
              <div className={styles.checkboxList}>
                {['역류성 식도염', '고혈압', '당뇨', '고지혈증'].map((disease, idx) => (
                  <label key={disease} className={styles.checkboxRow}>
                    <input type="checkbox" defaultChecked={idx === 0} className={styles.checkboxInput} />
                    <span>{disease}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className={styles.bottomSummarySection}>
          <div className={styles.summaryTitle}>입력 요약</div>
          <div className={styles.badgeList}>
            <span className={styles.badge}>체지방률 00.0%</span>
            <span className={styles.badge}>골격근량 00.0kg</span>
            <span className={styles.badge}>근육량 증가 (+0kg)</span>
            <span className={styles.badge}>주 0~0회 · 보통 강도</span>
            <span className={styles.badge}>역류성 식도염</span>
          </div>
          <button type="button" className={styles.submitBtn}>
            저장하고 스펙 보드 반영
          </button>
        </div>
      </div>
    </div>
  )
}