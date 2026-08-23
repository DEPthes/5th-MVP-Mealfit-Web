export const config = {
  runtime: 'edge',
}

export default async function handler(request: Request) {
  const backend = process.env.VITE_API_BASE_URL

  if (!backend) {
    return new Response('VITE_API_BASE_URL is not set', { status: 500 })
  }

  const incoming = new URL(request.url)
  const target = `${backend.replace(/\/$/, '')}${incoming.pathname}${incoming.search}`
  const headers = new Headers()
  const contentType = request.headers.get('content-type')
  const authorization = request.headers.get('authorization')

  if (contentType) {
    headers.set('content-type', contentType)
  }

  if (authorization) {
    headers.set('authorization', authorization)
  }

  const method = request.method
  const hasBody = method !== 'GET' && method !== 'HEAD'
  const response = await fetch(target, {
    method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
  })

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  })
}
