import { apiFetch } from './client'
import type {
  ApiResponse,
  Gender,
  Goal,
} from './types'

export interface SignupRequest {
  email: string
  password: string
  nickname: string
  height?: number
  gender: Gender
  birthDate: string
  goal: Goal
}

export interface LoginData {
  accessToken: string
  memberId: number
  nickname: string
}

export async function signup(
  data: SignupRequest,
): Promise<ApiResponse<number>> {
  return apiFetch<ApiResponse<number>>('/api/members/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function requestPasswordReset(
  email: string,
): Promise<ApiResponse<string>> {
  return apiFetch<ApiResponse<string>>(
    '/api/members/password/reset-request',
    {
      method: 'POST',
      body: JSON.stringify({ email }),
    },
  )
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<ApiResponse<string>> {
  return apiFetch<ApiResponse<string>>('/api/members/password/reset', {
    method: 'POST',
    body: JSON.stringify({
      token,
      newPassword,
    }),
  })
}

export async function login(
  email: string,
  password: string,
): Promise<ApiResponse<LoginData>> {
  return apiFetch<ApiResponse<LoginData>>('/api/members/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  })
}
