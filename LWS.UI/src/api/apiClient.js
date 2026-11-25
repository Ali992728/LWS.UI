const TOKEN_STORAGE_KEY = 'lws_token'

export function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setStoredToken(token) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

export function parseJwt(token) {
  if (!token || typeof token !== 'string') return null
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    const payload = JSON.parse(jsonPayload)
    return {
      name:
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
        payload.name ||
        '',
      email:
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
        payload.email ||
        '',
      id:
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
        payload.sub ||
        '',
      role:
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        payload.role ||
        '',
      exp: typeof payload.exp === 'number' ? payload.exp : null,
    }
  } catch {
    return null
  }
}

export function isTokenExpired(parsedUser) {
  if (!parsedUser || !parsedUser.exp) return false
  return parsedUser.exp * 1000 <= Date.now()
}

export async function apiRequest(endpoint, options = {}) {
  const token = getStoredToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    const parsed = parseJwt(token)
    if (parsed && !isTokenExpired(parsed)) {
      headers.Authorization = `Bearer ${token}`
    } else {
      clearStoredToken()
      window.dispatchEvent(new Event('lws:unauthorized'))
    }
  }

  let response
  try {
    response = await fetch(endpoint, {
      ...options,
      headers,
    })
  } catch {
    throw new Error(
      'Unable to reach the backend API. Make sure the ASP.NET Core server is running.'
    )
  }

  if (response.status === 401) {
    clearStoredToken()
    window.dispatchEvent(new Event('lws:unauthorized'))
    throw new Error('Your session has expired or is unauthorized. Please sign in again.')
  }

  if (response.status === 403) {
    throw new Error('Access denied. Admin role is required for this action.')
  }

  const payload = await response.json().catch(() => null)

  if (!response.ok || (payload && payload.status === false)) {
    throw new Error(payload?.message || `Request failed (${response.status}).`)
  }

  return payload
}
