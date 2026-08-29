import { apiFetch } from './client'
import type {
  ApiResponse,
  Disease,
  ExerciseCount,
  ExerciseIntensity,
  Gender,
  Goal,
} from './types'

export interface MemberProfile {
  memberId: number
  nickname: string
  email: string
  height?: number
  targetWeight?: number
  gender: Gender
  birthDate: string
  goal: Goal
  hasTarget: boolean
  exerciseCount?: ExerciseCount
  exerciseIntensity?: ExerciseIntensity
  diseases?: Disease[]
}

export interface UpdateMemberRequest {
  nickname?: string
  height?: number
  targetWeight?: number
  goal?: Goal
  exerciseCount?: ExerciseCount
  exerciseIntensity?: ExerciseIntensity
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