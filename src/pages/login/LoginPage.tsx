import { type FormEvent, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './LoginPage.module.css'
import { DEMO_ACCOUNT, login, signup } from '@/api/auth'
import type { ActivityLevel, Gender, Goal } from '@/api/types'
import { saveAuthSession } from '@/utils/authSession'

type AuthMode = 'login' | 'signup' | 'reset'

type LoginPageProps = {
  initialMode?: AuthMode
}

export function LoginPage({ initialMode = 'login' }: LoginPageProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo =
    typeof location.state === 'object' &&
    location.state !== null &&
    'from' in location.state &&
    typeof location.state.from === 'string'
      ? location.state.from
      : '/'
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [height, setHeight] = useState('')
  const [gender, setGender] = useState<Gender>('MALE')
  const [birthDate, setBirthDate] = useState('')
  const [activityLevel, setActivityLevel] =
    useState<ActivityLevel>('SEDENTARY')
  const [goal, setGoal] = useState<Goal>('MAINTAIN')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode)
    setMessage('')
  }

  const saveLogin = async () => {
    const response = await login(email, password)

    if (!response.success || !response.data?.accessToken) {
      throw new Error(response.message || '로그인에 실패했습니다.')
    }

    saveAuthSession(response.data)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')

    if (mode === 'reset') {
      setMessage('비밀번호 재설정 API가 준비되지 않았습니다.')
      return
    }

    setIsSubmitting(true)

    try {
      if (mode === 'login') {
        await saveLogin()
        navigate(redirectTo, { replace: true })
        return
      }

      const parsedHeight = height ? Number(height) : undefined

      if (parsedHeight !== undefined && parsedHeight <= 0) {
        throw new Error('키는 양수로 입력해 주세요.')
      }

      const response = await signup({
        email,
        password,
        nickname: nickname.trim(),
        height: parsedHeight,
        gender,
        birthDate,
        activityLevel,
        goal,
      })

      if (!response.success || response.data == null) {
        throw new Error(response.message || '회원가입에 실패했습니다.')
      }

      await saveLogin()
      navigate('/health-data')
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : mode === 'login'
            ? '로그인에 실패했습니다.'
            : '회원가입에 실패했습니다.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const isSignupValid =
    nickname.trim() !== '' &&
    birthDate !== '' &&
    (!height || Number(height) > 0)

  const isFormValid =
    email.trim() !== '' &&
    (mode === 'reset' || password !== '') &&
    (mode !== 'signup' || isSignupValid)

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
        {mode === 'login' && (
          <p className={styles.subTitle}>
            임시 계정: {DEMO_ACCOUNT.email} / {DEMO_ACCOUNT.password}
          </p>
        )}
      </div>

      {/* 로그인/회원가입 탭 */}
      {mode !== 'reset' && (
        <div className={styles.tabGroup}>
          <button
            type="button"
            className={`${styles.tab} ${
              mode === 'login' ? styles.activeTab : ''
            }`}
            onClick={() => changeMode('login')}
          >
            로그인
          </button>

          <button
            type="button"
            className={`${styles.tab} ${
              mode === 'signup' ? styles.activeTab : ''
            }`}
            onClick={() => changeMode('signup')}
          >
            회원가입
          </button>
        </div>
      )}

      {/* 폼 영역 */}
      <form className={styles.formCard} onSubmit={handleSubmit}>
        {/* 회원가입 시 닉네임 입력창 */}
        {mode === 'signup' && (
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="signup-nickname">
              닉네임
            </label>

            <input
              id="signup-nickname"
              type="text"
              placeholder="홍길동"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              className={styles.input}
              required
            />
          </div>
        )}

        {/* 공통 이메일 입력창 */}
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="auth-email">
            이메일 (아이디)
          </label>

          <input
            id="auth-email"
            type="email"
            placeholder="you@myongji.ac.kr"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={styles.input}
            required
          />
        </div>

        {/* 비밀번호 입력창 */}
        {mode !== 'reset' && (
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="auth-password">
              비밀번호
            </label>

            <input
              id="auth-password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={styles.input}
              required
            />
          </div>
        )}

        {mode === 'signup' && (
          <>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="signup-birth-date">
                  생년월일
                </label>
                <input
                  id="signup-birth-date"
                  type="date"
                  value={birthDate}
                  onChange={(event) => setBirthDate(event.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="signup-gender">
                  성별
                </label>
                <select
                  id="signup-gender"
                  value={gender}
                  onChange={(event) =>
                    setGender(event.target.value as Gender)
                  }
                  className={styles.input}
                >
                  <option value="MALE">남성</option>
                  <option value="FEMALE">여성</option>
                </select>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="signup-height">
                키 (cm, 선택)
              </label>
              <input
                id="signup-height"
                type="number"
                min="0.1"
                step="0.1"
                placeholder="175.0"
                value={height}
                onChange={(event) => setHeight(event.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="signup-activity">
                  활동량
                </label>
                <select
                  id="signup-activity"
                  value={activityLevel}
                  onChange={(event) =>
                    setActivityLevel(event.target.value as ActivityLevel)
                  }
                  className={styles.input}
                >
                  <option value="SEDENTARY">운동 거의 안 함</option>
                  <option value="LIGHT">주 1~2회</option>
                  <option value="MODERATE">주 3~4회</option>
                  <option value="ACTIVE">주 5~6회</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="signup-goal">
                  목표
                </label>
                <select
                  id="signup-goal"
                  value={goal}
                  onChange={(event) => setGoal(event.target.value as Goal)}
                  className={styles.input}
                >
                  <option value="LOSS">체중 감량</option>
                  <option value="MAINTAIN">체중 유지</option>
                  <option value="GAIN">근육량 증가</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* 로그인 모드일 때만 보이는 비밀번호 재설정 버튼 */}
        {mode === 'login' && (
          <button
            type="button"
            className={styles.linkText}
            onClick={() => changeMode('reset')}
          >
            비밀번호를 잊으셨나요?
          </button>
        )}

        {message && (
          <p className={styles.message} role="alert">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`${styles.submitBtn} ${
            isFormValid && !isSubmitting ? styles.activeSubmitBtn : ''
          }`}
        >
          {isSubmitting
            ? '처리 중...'
            : mode === 'login'
              ? '로그인'
              : mode === 'signup'
                ? '회원가입하고 시작하기'
                : '비밀번호 재설정 이메일 받기'}
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
            onClick={() => changeMode('login')}
          >
            로그인 화면으로 돌아가기
          </button>
        )}
      </form>
    </div>
  )
}

export default LoginPage