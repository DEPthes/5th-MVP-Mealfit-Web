import { useState } from 'react'
import styles from './LoginPage.module.css'

type AuthMode = 'login' | 'signup' | 'reset'

export function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  return (
    <div className={styles.container}>
      {/* 상단 타이틀 영단 */}
      <div className={styles.titleGroup}>
        <h1 className={styles.title}>
          {mode === 'reset' ? '비밀번호 재설정' : '로그인 / 회원가입'}
        </h1>
        <p className={styles.subTitle}>
          {mode === 'reset'
            ? '가입했던 이메일을 입력하시면 비밀번호 재설정 링크를 보냅니다.'
            : '사용자는 이메일과 비밀번호로 회원가입 후 로그인하여 서비스를 이용합니다.'}
        </p>
      </div>

      {/* 로그인/회원가입 탭 (비밀번호 재설정 모드일 때는 숨김) */}
      {mode !== 'reset' && (
        <div className={styles.tabGroup}>
          <button
            type="button"
            className={`${styles.tab} ${mode === 'login' ? styles.activeTab : ''}`}
            onClick={() => setMode('login')}
          >
            로그인
          </button>
          <button
            type="button"
            className={`${styles.tab} ${mode === 'signup' ? styles.activeTab : ''}`}
            onClick={() => setMode('signup')}
          >
            회원가입
          </button>
        </div>
      )}

      {/* 폼 영역 */}
      <div className={styles.formCard}>
        {/* 회원가입 시 이름 입력창 */}
        {mode === 'signup' && (
          <div className={styles.inputGroup}>
            <label className={styles.label}>이름</label>
            <input
              type="text"
              placeholder="홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
            />
          </div>
        )}

        {/* 공통 이메일 입력창 */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>이메일 (아이디)</label>
          <input
            type="email"
            placeholder="you@myongji.ac.kr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
        </div>

        {/* 비밀번호 입력창 (재설정 모드일 때는 숨김) */}
        {mode !== 'reset' && (
          <div className={styles.inputGroup}>
            <label className={styles.label}>비밀번호</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
          </div>
        )}

        {/* 로그인 모드일 때만 보이는 '비밀번호 재설정' 버튼 */}
        {mode === 'login' && (
          <button
            type="button"
            className={styles.linkText}
            onClick={() => setMode('reset')}
          >
            비밀번호를 잊으셨나요?
          </button>
        )}

        {/* 제출 버튼 */}
        <button
          type="button"
          className={`${styles.submitBtn} ${
            email && (mode === 'reset' || password) ? styles.activeSubmitBtn : ''
          }`}
        >
          {mode === 'login' && '로그인'}
          {mode === 'signup' && '회원가입하고 시작하기'}
          {mode === 'reset' && '비밀번호 재설정 이메일 받기'}
        </button>

        {/* 안내 문구 및 돌아가기 링크 */}
        {mode === 'signup' && (
          <p className={styles.footerHint}>
            가입 직후에는 건강 데이터 입력 화면으로 먼저 이동해요.
          </p>
        )}

        {mode === 'reset' && (
          <button
            type="button"
            className={styles.backToLogin}
            onClick={() => setMode('login')}
          >
            로그인 화면으로 돌아가기
          </button>
        )}
      </div>
    </div>
  )
}

export default LoginPage