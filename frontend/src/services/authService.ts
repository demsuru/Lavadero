import api from './api'
import type { TokenResponse, AuthenticatedUser, LoginCredentials } from '../types'

const authService = {
  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    const { data } = await api.post<TokenResponse>('/auth/login', credentials)
    return data
  },

  async me(): Promise<AuthenticatedUser> {
    const { data } = await api.get<AuthenticatedUser>('/auth/me')
    return data
  },
}

export default authService
