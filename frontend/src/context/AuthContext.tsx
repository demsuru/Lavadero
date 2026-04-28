import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { AuthenticatedUser, LoginCredentials } from '../types'
import authService from '../services/authService'

const TOKEN_KEY = 'lavadero_token'

interface AuthContextValue {
  user: AuthenticatedUser | null
  token: string | null
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [isLoading, setIsLoading] = useState(true)

  // On mount, verify stored token is still valid
  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      return
    }
    authService.me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
      })
      .finally(() => setIsLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials)
    localStorage.setItem(TOKEN_KEY, response.access_token)
    setToken(response.access_token)
    setUser(response.user)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export { TOKEN_KEY }
