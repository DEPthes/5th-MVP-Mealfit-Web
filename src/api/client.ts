const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const accessToken = localStorage.getItem('accessToken')
  const isFormData = options?.body instanceof FormData

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      // FormData는 브라우저가 boundary를 포함한 Content-Type을 자동으로 설정해야 함
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),

      ...(accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {}),

      ...options?.headers,
    },
  })

  if (!response.ok) {
    let message = `API 요청 실패: ${response.status}`

    try {
      const errorBody = await response.json()
      message = errorBody.message ?? message
    } catch {
      // JSON 응답이 아니면 기본 메시지 사용
    }

    throw new Error(message)
  }

  // PATCH처럼 응답 body가 없는 경우도 대비
  const text = await response.text()
  return text ? (JSON.parse(text) as T) : (undefined as T)
}

export function buildQuery(params: object) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value))
    }
  })

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}