import { apiFetch } from './client'
import type { ApiResponse } from './types'

export interface SignupRequest {
  email: string
  password: string
  nickname: string
  height?: number
  gender: 'MALE' | 'FEMALE'
  birthDate: string
  activityLevel: 'SEDENTARY' | 'LIGHT' | 'MODERATE' | 'ACTIVE'
  goal: 'LOSS' | 'MAINTAIN' | 'GAIN'
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
