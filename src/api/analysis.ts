import { apiFetch, buildQuery } from './client'
import type { ApiResponse, Nutrition } from './types'

export interface TargetResponse {
  dailyTarget: Nutrition
  perMealTarget: Nutrition
  basisInbodyId: number
  calculatedAt: string
  outdated: boolean
}

export interface Deficiency {
  priority: number
  issue: string
  relatedDiseases: string[]
  description: string
}

export interface AiReportResponse {
  healthScore: number
  dailyTarget: Nutrition
  deficiencies: Deficiency[]
  summary: string
  basisInbodyId: number
}

export interface ScoreHistoryItem {
  measuredAt: string
  inbodyScore: number
}

export interface AnalysisHistoryItem {
  measuredAt: string
  uploadedAt: string
  inbodyScore: number
  proteinTarget?: number
}

export async function calculateTargets(): Promise<ApiResponse<TargetResponse>> {
  return apiFetch<ApiResponse<TargetResponse>>('/api/targets', {
    method: 'POST',
  })
}

export async function getMyTargets(): Promise<ApiResponse<TargetResponse>> {
  return apiFetch<ApiResponse<TargetResponse>>('/api/targets/me', {
    method: 'GET',
  })
}

export async function getAiReport(): Promise<ApiResponse<AiReportResponse>> {
  return apiFetch<ApiResponse<AiReportResponse>>('/api/reports/me', {
    method: 'GET',
  })
}

export async function getScoreHistory(
  expanded = false,
): Promise<ApiResponse<ScoreHistoryItem[]>> {
  return apiFetch<ApiResponse<ScoreHistoryItem[]>>(
    `/api/reports/scores${buildQuery({ expanded })}`,
    {
      method: 'GET',
    },
  )
}

export async function getAnalysisHistory(
  expanded = false,
): Promise<ApiResponse<AnalysisHistoryItem[]>> {
  return apiFetch<ApiResponse<AnalysisHistoryItem[]>>(
    `/api/reports/analysis-history${buildQuery({ expanded })}`,
    {
      method: 'GET',
    },
  )
}
