import { type FormEvent, useState } from 'react'
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { resetPassword } from '@/api/auth'
import { getResetTokenFromSearch } from '@/utils/resetLink'
import styles from './PasswordResetPage.module.css'

function isValidNewPassword(value: string) {
  return (
    value.length >= 8 &&
    value.length <= 30 &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  )
}

export function PasswordResetPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { token: tokenParam } = useParams()
  const [searchParams] = useSearchParams()
  const token = getResetTokenFromSearch(
    location.search,
    searchParams,
    tokenParam,
  )

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const isFormValid =
    token.trim() !== '' &&
    isValidNewPassword(newPassword) &&
    confirmPassword !== ''

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    setIsSuccess(false)

    if (!isValidNewPassword(newPassword)) {
      setMessage(
        '영문 대문자·소문자·특수문자를 각 1자 이상 포함해 8~30자로 입력해 주세요.',
      )
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage('새 비밀번호가 일치하지 않습니다.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await resetPassword(token.trim(), newPassword)

      if (!response.success) {
        throw new Error(
          response.message || '비밀번호 재설정에 실패했습니다.',
        )
      }

      setIsSuccess(true)
      setMessage('비밀번호가 변경되었습니다. 로그인해 주세요.')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : '비밀번호 재설정에 실패했습니다.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.titleGroup}>
        <h1 className={styles.title}>새 비밀번호 설정</h1>
        <p className={styles.subTitle}>
          {token
            ? '새로 사용할 비밀번호를 입력해 주세요. 영문 대문자·소문자·특수문자를 각 1자 이상 포함해 8~30자로 입력해 주세요.'
            : '재설정 링크가 올바르지 않거나 만료되었습니다. 이메일을 다시 요청해 주세요.'}
        </p>
      </div>

      <form className={styles.formCard} onSubmit={handleSubmit}>
        <div className={styles.formInner}>
          {token && !isSuccess && (
            <div className={styles.fields}>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="reset-password">
                  새 비밀번호
                </label>
                <input
                  id="reset-password"
                  type="password"
                  placeholder="8~30자, 대/소문자+특수문자 포함"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className={styles.input}
                  required
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={30}
                />
              </div>

              <div className={styles.inputGroup}>
                <label
                  className={styles.label}
                  htmlFor="reset-password-confirm"
                >
                  새 비밀번호 확인
                </label>
                <input
                  id="reset-password-confirm"
                  type="password"
                  placeholder="다시 한 번 입력"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  className={styles.input}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>
          )}

          {message && (
            <p
              className={
                isSuccess ? styles.successMessage : styles.message
              }
              role="alert"
            >
              {message}
            </p>
          )}

          {token && !isSuccess && (
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`${styles.submitBtn} ${
                isFormValid && !isSubmitting ? styles.activeSubmitBtn : ''
              }`}
            >
              {isSubmitting ? '처리 중...' : '비밀번호 변경하기'}
            </button>
          )}

          {(!token || isSuccess) && (
            <button
              type="button"
              className={styles.loginBtn}
              onClick={() => navigate('/login')}
            >
              로그인하기
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default PasswordResetPage
