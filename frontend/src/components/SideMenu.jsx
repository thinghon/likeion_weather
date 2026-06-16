import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { id: 'map',      label: 'Live Map',   icon: '🗺️',  path: '/' },
  { id: 'insights', label: 'Insights',   icon: '📊',  path: '/insights' },
  { id: 'journal',  label: 'My Journal', icon: '📓',  path: '/journal' },
]

const BOTTOM_ITEMS = [
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'support',  label: 'Support',  icon: '❓' },
]

export default function SideMenu() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleNav = (path) => {
    navigate(path)
    setOpen(false)
  }

  return (
    <>
      <button className="menu-fab" onClick={() => setOpen(true)} aria-label="메뉴 열기">
        ☰
      </button>

      {open && (
        <div className="drawer-overlay" onClick={() => setOpen(false)} />
      )}

      <aside className={`drawer ${open ? 'open' : ''}`}>
        <div className="drawer-logo">
          <span className="drawer-logo-icon">🌤️</span>
          <span className="drawer-logo-text">감정 날씨 지도</span>
        </div>

        <nav className="drawer-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`drawer-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => handleNav(item.path)}
            >
              <span className="drawer-icon">{item.icon}</span>
              <span className="drawer-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="drawer-bottom">
          {BOTTOM_ITEMS.map(item => (
            <button key={item.id} className="drawer-item">
              <span className="drawer-icon">{item.icon}</span>
              <span className="drawer-label">{item.label}</span>
            </button>
          ))}
        </div>
      </aside>
    </>
  )
}
