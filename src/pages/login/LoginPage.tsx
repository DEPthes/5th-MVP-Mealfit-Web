import { type FormEvent, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './LoginPage.module.css'
import {
  login,
  requestPasswordReset,
  signup,
} from '@/api/auth'
import { saveAuthSession } from '@/utils/authSession'
import resetLinkIcon from '@/assets/icons/reset-link.svg'

type AuthMode = 'login' | 'signup' | 'reset'


function isValidEmail(value: string) {
  const trimmed = value.trim()
  return trimmed.length <= 30 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
}


function isValidPassword(value: string) {
  if (value.length < 8 || value.length > 30) return false
  const hasUpperCase = /[A-Z]/.test(value)
  const hasLowerCase = /[a-z]/.test(value)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value)
  return hasUpperCase && hasLowerCase && hasSpecialChar
}

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode)
    setMessage('')
    setIsSuccess(false)
  }

  const saveLogin = async () => {
    const response = await login(email, password)

    if (!response.success || !response.data?.accessToken) {
      throw new Error(response.message || '아이디 또는 비밀번호가 올바르지 않습니다.')
    }

    saveAuthSession(response.data)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    setIsSuccess(false)
    setIsSubmitting(true)

    try {
      if (mode === 'reset') {
        const response = await requestPasswordReset(email.trim())

        if (!response.success) {
          throw new Error(
            response.message || '재설정 이메일 요청에 실패했습니다.',
          )
        }

        setIsSuccess(true)
        return
      }

      if (mode === 'login') {
        await saveLogin()
        navigate(redirectTo, { replace: true })
        return
      }

   
      const response = await signup({
        email: email.trim(),
        password,
        nickname: nickname.trim(),
        gender: 'MALE',
        birthDate: '2000-01-01',
        goal: 'MAINTAIN',
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
          : '요청 처리 중 오류가 발생했습니다.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }


  const isFormValid =
    mode === 'reset'
      ? isValidEmail(email)
      : mode === 'signup'
        ? nickname.trim() !== '' && isValidEmail(email) && isValidPassword(password)
        : isValidEmail(email) && password !== ''

  const getTitle = () => {
    if (mode === 'reset') return '비밀번호 재설정'
    if (mode === 'signup') return '회원가입'
    return '로그인'
  }

  const getSubTitle = () => {
    if (mode === 'reset') {
      return '가입할 때 사용한 이메일을 입력하시면, 비밀번호 재설정 링크를 보내드려요.'
    }
    return '사용자는 이메일과 비밀번호로 회원가입 후 로그인하여 서비스를 이용합니다. 로그인 시 JWT 기반 인증 토큰이 발급됩니다.'
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>{getTitle()}</h1>
          <p className={styles.subTitle}>{getSubTitle()}</p>
        </div>

        {mode === 'reset' && isSuccess ? (
          <div className={styles.sentCard}>
            <div className={styles.sentContent}>
              <div className={styles.sentIcon}>
                <img
                  src={resetLinkIcon}
                  alt="전송 완료"
                  width={43.6}
                  height={43.5}
                />
              </div>
              <div className={styles.sentText}>
                <p className={styles.sentHeading}>재설정 링크를 보냈어요</p>
                <p className={styles.sentDesc}>
                  입력한 이메일로 비밀번호 재설정 링크를 전송했습니다.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form
            className={`${styles.formCard} ${
              mode === 'login'
                ? styles.loginFormCard
                : mode === 'signup'
                  ? styles.signupFormCard
                  : styles.resetFormCard
            }`}
            onSubmit={handleSubmit}
          >
            <div className={styles.formBody}>
              {mode === 'signup' && (
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="signup-nickname">
                    이름
                  </label>
                  <input
                    id="signup-nickname"
                    type="text"
                    placeholder="홍길동"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className={styles.input}
                    required
                  />
                </div>
              )}

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="auth-email">
                  이메일 (아이디)
                </label>
                <input
                  id="auth-email"
                  type="email"
                  maxLength={30}
                  placeholder="you@myongji.ac.kr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  required
                />
                {mode === 'signup' && (
                  <span className={styles.inputHelp}>
                    30자 이내로 입력해 주세요.
                  </span>
                )}
              </div>

              {mode !== 'reset' && (
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="auth-password">
                    비밀번호
                  </label>
                  <input
                    id="auth-password"
                    type="password"
                    maxLength={30}
                    placeholder={
                      mode === 'signup'
                        ? '8~30자, 대/소문자+특수문자 포함'
                        : '********'
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    required
                  />
                  {mode === 'signup' && (
                    <span className={styles.inputHelp}>
                      영문 대문자·소문자·특수문자를 각 1자 이상 포함해 8~30자로 입력해 주세요.
                    </span>
                  )}
                  {mode === 'login' && (
                    <button
                      type="button"
                      className={styles.forgotLink}
                      onClick={() => changeMode('reset')}
                    >
                      비밀번호를 잊으셨나요?
                    </button>
                  )}
                </div>
              )}
            </div>

            {message && (
              <p
                className={isSuccess ? styles.successMessage : styles.message}
                role="alert"
              >
                {message}
              </p>
            )}

            <div className={styles.actionGroup}>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`${styles.submitBtn} ${
                  isFormValid && !isSubmitting ? styles.activeSubmitBtn : ''
                }`}
              >
                {isSubmitting
                  ? '처리 중...'
                  : mode === 'signup'
                    ? '회원가입하고 시작하기'
                    : mode === 'reset'
                      ? '재설정 링크 보내기'
                      : '로그인'}
              </button>

              {mode === 'login' && (
                <div className={styles.footerRow}>
                  <span>계정이 필요한가요?</span>
                  <button
                    type="button"
                    className={styles.switchLink}
                    onClick={() => changeMode('signup')}
                  >
                    회원가입
                  </button>
                </div>
              )}

              {mode === 'signup' && (
                <div className={styles.footerRow}>
                  <span className={styles.inputHelp}>
                    가입 직후에는 건강 데이터 입력 화면으로 먼저 이동해요.
                  </span>
                </div>
              )}

              {mode === 'reset' && (
                <button
                  type="button"
                  className={styles.resetBackLink}
                  onClick={() => changeMode('login')}
                >
                  로그인으로 돌아가기
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default LoginPage