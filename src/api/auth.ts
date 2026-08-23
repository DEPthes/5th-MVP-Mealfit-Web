import { apiFetch } from './client'
import type {
  ActivityLevel,
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
  activityLevel: ActivityLevel
  goal: Goal
}

export interface LoginData {
  accessToken: string
  memberId: number
  nickname: string
}

export const DEMO_ACCOUNT = {
  email: 'demo@mealfit.local',
  password: 'demo1234!',
  memberId: 0,
  nickname: '데모유저',
} as const

function createDemoLoginResponse(): ApiResponse<LoginData> {
  return {
    success: true,
    code: 'OK',
    message: '요청이 성공했습니다.',
    data: {
      accessToken: 'demo-access-token',
      memberId: DEMO_ACCOUNT.memberId,
      nickname: DEMO_ACCOUNT.nickname,
    },
  }
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
  if (
    email === DEMO_ACCOUNT.email &&
    password === DEMO_ACCOUNT.password
  ) {
    return createDemoLoginResponse()
  }

  return apiFetch<ApiResponse<LoginData>>('/api/members/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  })
}
