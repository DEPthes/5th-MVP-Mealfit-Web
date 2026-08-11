import styles from './MyPage.module.css'

export function MyPage() {
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
              <div className={styles.avatar}>김</div>
              <div className={styles.userInfo}>
                <h2 className={styles.userName}>김명지</h2>
                <span className={styles.userEmail}>myongji_kim@mju.ac.kr</span>
              </div>
            </div>
            <button type="button" className={styles.editProfileBtn}>
              정보 수정
            </button>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <div className={styles.statValue}>00점</div>
              <div className={styles.statLabel}>인바디 점수</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statValue}>0</div>
              <div className={styles.statLabel}>인바디 업로드</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statValue}>2026.00.00</div>
              <div className={styles.statLabel}>가입일</div>
            </div>
          </div>

          <div className={styles.historyCard}>
            <h3 className={styles.cardTitle}>추천 이력</h3>
            <ul className={styles.historyList}>
              <li className={styles.historyItem}>
                <div className={styles.historyName}>
                  <span className={styles.historyNum}>01</span> 보쌈 정식
                </div>
                <button type="button" className={styles.detailBtn}>상세보기</button>
              </li>
              <li className={styles.historyItem}>
                <div className={styles.historyName}>
                  <span className={styles.historyNum}>02</span> 연어 포케
                </div>
                <button type="button" className={styles.detailBtn}>상세보기</button>
              </li>
              <li className={styles.historyItem}>
                <div className={styles.historyName}>
                  <span className={styles.historyNum}>03</span> 닭가슴살 곡물 샐러드
                </div>
                <button type="button" className={styles.detailBtn}>상세보기</button>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.healthSummaryCard}>
            <h3 className={styles.cardTitle}>건강 데이터 요약</h3>
            <div className={styles.infoList}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>최근 인바디 업로드</span>
                <span className={styles.infoValue}>2026.00.00</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>목표</span>
                <span className={styles.infoValue}>근육량 증가 +0kg</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>활동량</span>
                <span className={styles.infoValue}>주 0~0회 · 보통 강도</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>기저질환</span>
                <span className={styles.infoValue}>역류성 식도염</span>
              </div>
            </div>
            <button type="button" className={styles.outlineBtn}>수정하기</button>
          </div>

          <div className={styles.inbodyHistoryCard}>
            <h3 className={styles.cardTitle}>인바디 업로드 이력</h3>
            <div className={styles.fileList}>
              <div className={styles.fileRow}>
                <span className={styles.fileName}>inbody_20260000.pdf</span>
                <span className={styles.fileStatus}>인식완료</span>
              </div>
              <div className={styles.fileRow}>
                <span className={styles.fileName}>inbody_20260000.pdf</span>
                <span className={styles.fileStatus}>인식완료</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPage