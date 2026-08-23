import { apiFetch } from './client'
import type {
  ActivityLevel,
  ApiResponse,
  Disease,
  Gender,
  Goal,
} from './types'

export interface MemberProfile {
  memberId: number
  email: string
  nickname: string
  height?: number
  gender: Gender
  birthDate: string
  activityLevel: ActivityLevel
  goal: Goal
  hasTarget: boolean
  diseases: Disease[]
}

export interface UpdateMemberRequest {
  nickname?: string
  height?: number
  activityLevel?: ActivityLevel
  goal?: Goal
  diseases?: Disease[]
}

export async function getMyProfile(): Promise<ApiResponse<MemberProfile>> {
  return apiFetch<ApiResponse<MemberProfile>>('/api/members/me', {
    method: 'GET',
  })
}

export async function updateMyProfile(
  data: UpdateMemberRequest,
): Promise<ApiResponse<null>> {
  return apiFetch<ApiResponse<null>>('/api/members/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}
