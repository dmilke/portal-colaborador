import type { AuthRepository } from '../repositories/auth-repository'
import type { AuthSession, ColaboradorSession, AuthError } from '../types'

export interface LoginResult {
  session: AuthSession | null
  error: AuthError | null
}

export interface AuthService {
  login(email: string, password: string): Promise<LoginResult>
  logout(): Promise<void>
  getSession(): Promise<AuthSession | null>
  getCurrentColaborador(): Promise<ColaboradorSession | null>
}

export function createAuthService(repository: AuthRepository): AuthService {
  return {
    async login(email, password) {
      try {
        const session = await repository.login(email, password)
        return { session, error: null }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido'
        return { session: null, error: { message } }
      }
    },

    async logout() {
      await repository.logout()
    },

    async getSession() {
      return repository.getSession()
    },

    async getCurrentColaborador() {
      return repository.getCurrentColaborador()
    },
  }
}
