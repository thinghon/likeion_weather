export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// 비로그인 사용자를 구분하는 기기별 세션 ID. 서버가 PATCH/DELETE 소유자 확인에 사용한다.
export const getSessionId = () => {
  let id = localStorage.getItem('mwm_session_id')
  if (!id) {
    id = 'user_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now()
    localStorage.setItem('mwm_session_id', id)
  }
  return id
}

// 로그인 상태별 지도 마커 슬롯 키. 로그인 사용자는 username별 슬롯, 비로그인은 익명 슬롯.
// localStorage를 직접 읽어 React 상태 타이밍과 무관하게 항상 현재 신원을 반영한다.
export const entryKey = () => {
  try {
    const u = JSON.parse(localStorage.getItem('user') || 'null')
    return u?.username ? `mwm_entry_${u.username}` : 'mwm_entry'
  } catch {
    return 'mwm_entry'
  }
}

export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token')

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  // 토큰 만료 시 자동 로그아웃
  if (res.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
    return
  }

  return res
}
