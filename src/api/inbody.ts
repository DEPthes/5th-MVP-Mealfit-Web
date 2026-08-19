import { apiFetch } from './client'
import type { ApiResponse } from './types'

export interface InbodyResponse {
  inbodyId: number
  weight: number
  skeletalMuscleMass: number
  bodyFatPercentage: number
  bmr: number
  visceralFatLevel: number
  inbodyScore: number
  measuredAt: string
  uploadedAt: string
  stale?: boolean
  imagePath?: string
}

export interface InbodyHistoryItem extends Omit<
  InbodyResponse,
  'stale' | 'imagePath'
> {
  originalFilename: string
  fileSize: number
  proteinTarget?: number
}

export async function uploadInbody(
  file: File,
): Promise<ApiResponse<InbodyResponse>> {
  const formData = new FormData()
  formData.append('file', file)

  return apiFetch<ApiResponse<InbodyResponse>>('/api/inbodies', {
    method: 'POST',
    body: formData,
  })
}

export async function getLatestInbody(): Promise<ApiResponse<InbodyResponse>> {
  return apiFetch<ApiResponse<InbodyResponse>>('/api/inbodies/latest', {
    method: 'GET',
  })
}

export async function getInbodyHistory(): Promise<
  ApiResponse<InbodyHistoryItem[]>
> {
  return apiFetch<ApiResponse<InbodyHistoryItem[]>>('/api/inbodies', {
    method: 'GET',
  })
}
