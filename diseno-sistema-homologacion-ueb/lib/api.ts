const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1').replace(/\/$/, '')

export type ApiUser = {
  id: number
  name: string
  email: string
  role?: { name: string } | string
}

export async function loginRequest(email: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || data.error || 'No se pudo iniciar sesión.')
  return data as { token?: string; access_token?: string; user?: ApiUser }
}

export async function getCurrentUser(token: string) {
  const response = await fetch(`${API_URL}/me`, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error('La sesión ha expirado.')
  return (await response.json()) as ApiUser
}

export function getApiUrl() {
  return API_URL
}
