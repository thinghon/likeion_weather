import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
      try {
        const raw = localStorage.getItem('user')
        if (raw) setUser(JSON.parse(raw))
      } catch {}
    }
  }, [])

  const login = (token, userInfo) => {
    localStorage.setItem('token', token)
    if (userInfo) localStorage.setItem('user', JSON.stringify(userInfo))
    setIsLoggedIn(true)
    setUser(userInfo || null)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // 마커 슬롯(mwm_entry / mwm_entry_<username>)은 신원별로 분리돼 있어 건드리지 않는다.
    // 로그아웃하면 익명 슬롯을 다시 보게 되고, 로그인 마커는 그대로 보존된다.
    setIsLoggedIn(false)
    setUser(null)
    navigate('/')
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
