import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, X, LogIn, LogOut } from 'lucide-react'
import KoreaMap from '../components/KoreaMap'
import SideMenu from '../components/SideMenu'
import EmotionEntryModal from '../components/EmotionEntryModal'
import { useAuth } from '../context/AuthContext'
import { entryKey } from '../utils/api'
import { EMOTIONS } from '../data/mockData'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function iconToWeather(icon) {
  if (icon.startsWith('01')) return 'sunny'
  if (icon.startsWith('02') || icon.startsWith('03') || icon.startsWith('04')) return 'cloudy'
  if (icon.startsWith('09') || icon.startsWith('10')) return 'rainy'
  if (icon.startsWith('11')) return 'storm'
  return 'cloudy'
}

const COMPARE_COMMENTS = {
  sunny:  { sunny: '☀️ 날씨도 기분도 맑은 하루네요!',           cloudy: '🤔 실제론 맑은데 기분은 흐리군요',              rainy: '😢 맑은 날씨인데 마음은 비가 오나요',          storm: '⛈️ 날씨와 달리 마음속엔 폭풍이 치네요' },
  cloudy: { sunny: '😊 흐린 날씨지만 기분만은 맑아요!',         cloudy: '☁️ 날씨도 기분도 조금 흐린 하루',               rainy: '🌧️ 흐린 날씨에 마음도 젖어드는 하루',          storm: '⛈️ 흐린 하늘처럼 마음도 무거운 하루' },
  rainy:  { sunny: '🌈 비 오는 날씨에도 기분은 화창해요!',      cloudy: '☁️ 빗속에서도 차분하게 하루를 보내는 중',         rainy: '🌧️ 날씨도 기분도 촉촉한 하루네요',             storm: '⛈️ 비까지 맞으며 힘든 하루를 보내고 있군요' },
  storm:  { sunny: '💪 폭풍 속에서도 굳건한 기분이네요!',       cloudy: '☁️ 거친 날씨에도 의연하게 버티는 중',            rainy: '🌧️ 폭풍우 같은 하루, 마음도 젖어드네요',       storm: '⛈️ 날씨도 마음도 폭풍 그 자체인 하루' },
}

// Time ago formatter helper
function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000)
  if (diff < 60) return `${diff}초 전`
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
  return `${Math.floor(diff / 86400)}일 전`
}

function WeatherCompareCard({ weather, weatherLoading, regionStats }) {
  const dominantEntry = regionStats
    ? Object.entries(regionStats).reduce((a, b) => b[1] >= a[1] ? b : a, ['sunny', -1])
    : null
  const dominant = dominantEntry && dominantEntry[1] > 0 ? dominantEntry[0] : null
  const dominantCount = dominant ? regionStats[dominant] : 0
  const emo = dominant ? EMOTIONS[dominant] : null
  const EmoIcon = emo ? emo.Icon : null

  if (weatherLoading) {
    return <div className="weather-compare-skeleton" />
  }

  if (!weather) {
    return (
      <div className="weather-compare-error">
        <p>날씨 정보를 불러올 수 없어요</p>
        {emo && (
          <div className="weather-emotion-solo">
            <div className="emotion-icon-circle" style={{ background: emo.color }}>
              <EmoIcon size={28} color={emo.iconColor} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, color: emo.text }}>{emo.label}</p>
            <p className="weather-meta">{dominantCount}명 참여</p>
          </div>
        )}
      </div>
    )
  }

  const realType = iconToWeather(weather.icon)
  const comment = dominant ? COMPARE_COMMENTS[realType]?.[dominant] : null

  return (
    <div className="weather-compare-card">
      <h4 className="weather-compare-title">실제 날씨 vs 감정 날씨</h4>
      <div className="weather-compare-body">
        <div className="weather-real">
          <p className="weather-section-label">실제 날씨</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            width="48"
            height="48"
            alt={weather.description}
          />
          <p className="weather-desc">{weather.description}</p>
          <p className="weather-temp">{weather.temp}°C</p>
          <div className="weather-meta-row">
            <span>💧 {weather.humidity}%</span>
            <span>💨 {weather.wind}km/h</span>
          </div>
        </div>
        <div className="weather-col-divider" />
        <div className="weather-emotion">
          <p className="weather-section-label">감정 날씨</p>
          {emo ? (
            <>
              <div className="emotion-icon-circle" style={{ background: emo.color }}>
                <EmoIcon size={28} color={emo.iconColor} />
              </div>
              <p className="weather-desc" style={{ color: emo.text }}>{emo.label}</p>
              <p className="weather-meta">{dominantCount}명 참여</p>
            </>
          ) : (
            <p className="weather-meta">기록 없음</p>
          )}
        </div>
      </div>
      {comment && (
        <div className="weather-compare-comment">{comment}</div>
      )}
    </div>
  )
}

function DonutChart({ stats }) {
  const total = Object.values(stats).reduce((a, b) => a + b, 0)
  if (total === 0) {
    return <div className="donut-empty">기록된 감정이 없습니다.</div>
  }

  const r = 50
  const circ = 2 * Math.PI * r
  
  // Calculate segments
  let accumulatedPercent = 0
  const segments = Object.keys(EMOTIONS).map(key => {
    const count = stats[key] || 0
    const percent = count / total
    const strokeLength = circ * percent
    const strokeOffset = circ - (circ * percent) + (circ * accumulatedPercent)
    accumulatedPercent += percent
    
    return {
      key,
      count,
      percent: Math.round(percent * 100),
      strokeLength,
      strokeOffset,
      color: EMOTIONS[key].border
    }
  })

  return (
    <div className="donut-chart-container">
      <svg width="160" height="160" viewBox="0 0 120 120" className="donut-svg">
        <circle cx="60" cy="60" r={r} fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
        {segments.map((seg, idx) => seg.count > 0 && (
          <circle
            key={idx}
            cx="60"
            cy="60"
            r={r}
            fill="transparent"
            stroke={seg.color}
            strokeWidth="12"
            strokeDasharray={circ}
            strokeDashoffset={seg.strokeOffset}
            transform="rotate(-90 60 60)"
            strokeLinecap="round"
            className="donut-segment"
          />
        ))}
        {/* Center Text */}
        <text x="60" y="58" textAnchor="middle" className="donut-center-total" dominantBaseline="middle">
          {total}
        </text>
        <text x="60" y="74" textAnchor="middle" className="donut-center-label" dominantBaseline="middle">
          총 기록
        </text>
      </svg>
      
      {/* Legend Grid */}
      <div className="donut-legend">
        {segments.map((seg) => {
          const emo = EMOTIONS[seg.key]
          return (
            <div key={seg.key} className="legend-item" style={{ opacity: seg.count === 0 ? 0.4 : 1 }}>
              <span className="legend-dot" style={{ backgroundColor: emo.border }} />
              <span className="legend-label">{emo.icon} {emo.label}</span>
              <span className="legend-value">{seg.percent}% ({seg.count}개)</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function MapPage() {
  const navigate = useNavigate()
  const { region } = useParams()
  const { isLoggedIn, user, logout } = useAuth()

  const [loginNudge, setLoginNudge] = useState(false)

  const [provinceMasks, setProvinceMasks] = useState([])
  const [individualMarks, setIndividualMarks] = useState([])
  const [userMarks, setUserMarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEntryModal, setShowEntryModal] = useState(() => {
    try {
      const raw = localStorage.getItem(entryKey())
      if (!raw) return true
      const saved = JSON.parse(raw)
      const today = new Date()
      const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
      return saved.date !== todayStr
    } catch { return true }
  })

  // Region panel states
  const [regionStats, setRegionStats] = useState(null)
  const [regionFeed, setRegionFeed] = useState([])
  const [loadingRegion, setLoadingRegion] = useState(false)

  // Real weather state
  const [weather, setWeather] = useState(null)
  const [weatherLoading, setWeatherLoading] = useState(false)

  // Fetch all map markers
  const fetchMapData = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/emotions/`)
      if (res.ok) {
        const json = await res.json()
        setProvinceMasks(json.province_masks ?? [])
        setIndividualMarks(json.individual_marks ?? [])
      }
    } catch (e) {
      console.error('Failed to fetch map data:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchWeather = useCallback(async (regName) => {
    setWeatherLoading(true)
    try {
      // 키는 백엔드에만 — 서버 프록시(/api/weather/)로 현재 날씨를 받아온다.
      const res = await fetch(`${API_URL}/api/weather/?region=${encodeURIComponent(regName)}`)
      const data = await res.json()
      setWeather(res.ok && data.available ? data : false)
    } catch {
      setWeather(false)
    } finally {
      setWeatherLoading(false)
    }
  }, [])

  // Fetch specific region stats
  const fetchRegionDetails = useCallback(async (regName) => {
    setLoadingRegion(true)
    try {
      const res = await fetch(`${API_URL}/api/emotions/region/${encodeURIComponent(regName)}/`)
      if (res.ok) {
        const json = await res.json()
        setRegionStats(json.stats)
        setRegionFeed(json.feed)
      }
    } catch (e) {
      console.error('Failed to fetch region details:', e)
    } finally {
      setLoadingRegion(false)
    }
  }, [])

  useEffect(() => {
    fetchMapData()
  }, [fetchMapData])

  // 현재 신원(로그인/비로그인)의 오늘 마커를 지도에 표시. 신원이 바뀌면 다시 읽는다.
  useEffect(() => {
    const raw = localStorage.getItem(entryKey())
    if (!raw) { setUserMarks([]); return }
    try {
      const saved = JSON.parse(raw)
      // 로컬(KST) 자정 기준으로 비교. toISOString은 UTC라 KST 00~09시에 전날로 잡히는 버그가 있었음.
      const d = new Date()
      const todayStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
      if (saved.date === todayStr && saved.latitude && saved.longitude) {
        setUserMarks([{
          id: 'user-today',
          serverId: saved.id,
          coordinates: [saved.longitude, saved.latitude],
          emotion: saved.emotion,
          comment: saved.comment || '',
          timestamp: saved.timestamp || Date.now(),
          region: saved.region || '내 위치'
        }])
      } else {
        setUserMarks([])
      }
    } catch { setUserMarks([]) }
  }, [user])

  useEffect(() => {
    if (region) {
      fetchRegionDetails(region)
      fetchWeather(region)
    } else {
      setRegionStats(null)
      setRegionFeed([])
      setWeather(null)
      setWeatherLoading(false)
    }
  }, [region, fetchRegionDetails, fetchWeather])

  // 내 마커는 localStorage(userMarks)와 백엔드(individualMarks) 양쪽에 존재한다.
  // 중복 표시를 막기 위해 백엔드 목록에서 내 항목을 제거한다(id 우선, 레거시는 좌표로 fallback).
  const myMark = userMarks[0]
  const visibleIndividualMarks = myMark
    ? individualMarks.filter(m =>
        myMark.serverId != null
          ? m.id !== myMark.serverId
          : !(m.coordinates[0] === myMark.coordinates[0] && m.coordinates[1] === myMark.coordinates[1])
      )
    : individualMarks

  return (
    <div className="main-page">
      <KoreaMap
        provinceMasks={provinceMasks}
        individualMarks={visibleIndividualMarks}
        userMarks={userMarks}
      />
      <SideMenu />

      {isLoggedIn ? (
        <button className="map-auth-btn" onClick={logout}>
          <LogOut size={16} /> 로그아웃
        </button>
      ) : (
        <button className="map-auth-btn" onClick={() => navigate('/login')}>
          <LogIn size={16} /> 로그인
        </button>
      )}

      <button className="fab" onClick={() => setShowEntryModal(true)} aria-label="기분 남기기">
        <Plus size={24} />
      </button>

      {showEntryModal && (
        <EmotionEntryModal
          onClose={() => setShowEntryModal(false)}
          onSubmitted={(entry) => {
            if (entry.latitude && entry.longitude) {
              setUserMarks([{
                id: 'user-today',
                serverId: entry.id,
                coordinates: [entry.longitude, entry.latitude],
                emotion: entry.emotion,
                comment: entry.comment || '',
                timestamp: entry.timestamp || Date.now(),
                region: entry.region || '내 위치',
              }])
            }
            if (!isLoggedIn) setLoginNudge(true)
          }}
        />
      )}

      {loginNudge && (
        <div className="login-nudge">
          <div className="login-nudge-content">
            <span>🌤️ 기록 완료! 로그인하면 어느 기기에서든 내 기록을 확인할 수 있어요</span>
            <div className="login-nudge-actions">
              <button className="login-nudge-cta" onClick={() => navigate('/login')}>로그인</button>
              <button className="login-nudge-close" onClick={() => setLoginNudge(false)}>✕</button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-over Drawer for Region Detail View */}
      <aside className={`region-drawer ${region ? 'open' : ''}`}>
        <div className="region-drawer-header">
          <div>
            <h2 className="region-drawer-title">📍 {region} 지역 상세</h2>
            <p className="region-drawer-subtitle">실시간 사람들의 날씨 상태</p>
          </div>
          <button className="region-drawer-close" onClick={() => navigate('/map')}><X size={20} /></button>
        </div>

        <div className="region-drawer-body">
          {loadingRegion ? (
            <div className="region-loading">
              <span className="location-dot loading" /> 정보를 불러오는 중...
            </div>
          ) : (
            <>
              {/* Real vs Emotion Weather Compare Card */}
              <WeatherCompareCard
                weather={weather}
                weatherLoading={weatherLoading}
                regionStats={regionStats}
              />

              {/* Emotion Stats Donut Chart */}
              <section className="drawer-section">
                <h3 className="section-title">📊 감정 날씨 비율</h3>
                {regionStats && <DonutChart stats={regionStats} />}
              </section>

              {/* Comments Feed list */}
              <section className="drawer-section comments-section">
                <h3 className="section-title">💬 익명 코멘트 피드</h3>
                {regionFeed.length === 0 ? (
                  <p className="no-comments">이 지역에 남겨진 기분 코멘트가 없습니다.</p>
                ) : (
                  <div className="comments-feed-list">
                    {regionFeed.map((item, idx) => {
                      const emo = EMOTIONS[item.emotion] || EMOTIONS.sunny
                      return (
                        <div key={idx} className="feed-card" style={{ borderLeftColor: emo.border }}>
                          <div className="feed-card-header">
                            <span className="feed-badge" style={{ backgroundColor: emo.color, color: emo.text }}>
                              {emo.icon} {emo.label}
                            </span>
                            <span className="feed-time">{timeAgo(item.timestamp)}</span>
                          </div>
                          <p className="feed-comment">{item.comment}</p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </aside>
    </div>
  )
}
