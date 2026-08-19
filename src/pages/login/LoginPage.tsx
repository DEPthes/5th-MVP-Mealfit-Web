import { useState } from 'react'
import styles from './LoginPage.module.css'
import { login } from '@/api/auth'

type AuthMode = 'login' | 'signup' | 'reset'

export function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = async () => {
    if (mode === 'login') {
      try {
        const response = await login(email, password)

        if (!response.data?.accessToken) {
          throw new Error(
            '로그인 응답에 accessToken이 없습니다.',
          )
        }

        console.log('로그인 성공:', response)

        const accessToken = response.data.accessToken

        localStorage.setItem('accessToken', accessToken)

        console.log('accessToken 저장 완료')
      } catch (error) {
        console.error('로그인 실패:', error)
      }

      return
    }

    if (mode === 'signup') {
      console.log('회원가입 UI - 아직 API 연결 전')
      return
    }

    if (mode === 'reset') {
      console.log('비밀번호 재설정 UI - 아직 API 연결 전')
    }
  }

  return (
    <div className={styles.container}>
      {/* 상단 타이틀 */}
      <div className={styles.titleGroup}>
        <h1 className={styles.title}>
          {mode === 'reset'
            ? '비밀번호 재설정'
            : '로그인 / 회원가입'}
        </h1>

        <p className={styles.subTitle}>
          {mode === 'reset'
            ? '가입했던 이메일을 입력하시면 비밀번호 재설정 링크를 보냅니다.'
            : '사용자는 이메일과 비밀번호로 회원가입 후 로그인하여 서비스를 이용합니다.'}
        </p>
      </div>

      {/* 로그인/회원가입 탭 */}
      {mode !== 'reset' && (
        <div className={styles.tabGroup}>
          <button
            type="button"
            className={`${styles.tab} ${
              mode === 'login' ? styles.activeTab : ''
            }`}
            onClick={() => setMode('login')}
          >
            로그인
          </button>

          <button
            type="button"
            className={`${styles.tab} ${
              mode === 'signup' ? styles.activeTab : ''
            }`}
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
          <label className={styles.label}>
            이메일 (아이디)
          </label>

          <input
            type="email"
            placeholder="you@myongji.ac.kr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
        </div>

        {/* 비밀번호 입력창 */}
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

        {/* 로그인 모드일 때만 보이는 비밀번호 재설정 버튼 */}
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
          onClick={() => void handleSubmit()}
          className={`${styles.submitBtn} ${
            email &&
            (mode === 'reset' || password)
              ? styles.activeSubmitBtn
              : ''
          }`}
        >
          {mode === 'login' && '로그인'}
          {mode === 'signup' &&
            '회원가입하고 시작하기'}
          {mode === 'reset' &&
            '비밀번호 재설정 이메일 받기'}
        </button>

        {/* 회원가입 안내 문구 */}
        {mode === 'signup' && (
          <p className={styles.footerHint}>
            가입 직후에는 건강 데이터 입력 화면으로 먼저
            이동해요.
          </p>
        )}

        {/* 로그인 화면으로 돌아가기 */}
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