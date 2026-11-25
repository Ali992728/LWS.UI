import { useCallback, useEffect, useState } from 'react'
import {
  clearStoredToken,
  getStoredToken,
  isTokenExpired,
  parseJwt,
  setStoredToken,
} from '../api/apiClient'
import { AuthContext } from './authContext'

function readInitialAuth() {
  const token = getStoredToken()
  if (!token) return { token: null, user: null }
  const parsed = parseJwt(token)
  if (!parsed || isTokenExpired(parsed)) {
    clearStoredToken()
    return { token: null, user: null }
  }
  return { token, user: parsed }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readInitialAuth)
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState('')

  const logout = useCallback((expiredMsg = '') => {
    clearStoredToken()
    setAuth({ token: null, user: null })
    setSessionExpiredMessage(expiredMsg)
  }, [])

  const loginWithToken = useCallback((token) => {
    const parsed = parseJwt(token)
    if (!parsed || isTokenExpired(parsed)) {
      clearStoredToken()
      setAuth({ token: null, user: null })
      return null
    }
    setStoredToken(token)
    setSessionExpiredMessage('')
    setAuth({ token, user: parsed })
    return parsed
  }, [])

  useEffect(() => {
    const handleUnauthorized = () => {
      logout('Your session expired. Please sign in again.')
    }
    window.addEventListener('lws:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('lws:unauthorized', handleUnauthorized)
  }, [logout])

  useEffect(() => {
    if (!auth.user?.exp) return undefined
    const msRemaining = auth.user.exp * 1000 - Date.now()
    if (msRemaining <= 0) {
      const immediateTimer = setTimeout(() => {
        logout('Your 5-minute session expired. Please sign in again.')
      }, 0)
      return () => clearTimeout(immediateTimer)
    }
    const timer = setTimeout(() => {
      logout('Your 5-minute session expired. Please sign in again.')
    }, msRemaining)
    return () => clearTimeout(timer)
  }, [auth.user, logout])

  const value = {
    token: auth.token,
    user: auth.user,
    isAuthenticated: Boolean(auth.token && auth.user),
    isAdmin: auth.user?.role === 'Admin',
    sessionExpiredMessage,
    clearSessionExpiredMessage: () => setSessionExpiredMessage(''),
    loginWithToken,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
