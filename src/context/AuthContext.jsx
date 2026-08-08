import { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { api } from '../lib/api.js'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('argust_jwt')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        if (decoded.exp * 1000 < Date.now()) {
          logout()
        } else {
          setUser({ ...decoded, token })
        }
      } catch {
        logout()
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('argust_jwt', data.token)
    setUser({ ...jwtDecode(data.token), token: data.token })
  }

  // NEW: Added registration function matching your Axum backend
  const registerAccount = async (email, password, company_name) => {
    const { data } = await api.post('/auth/register', { email, password, company_name })
    localStorage.setItem('argust_jwt', data.token)
    setUser({ ...jwtDecode(data.token), token: data.token })
  }

  const logout = () => {
    localStorage.removeItem('argust_jwt')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, registerAccount, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)