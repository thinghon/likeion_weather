import { useState, useEffect } from 'react'
import { HelpCircle } from 'lucide-react'
import SideMenu from '../components/SideMenu'
import WeatherDetailModal from '../components/WeatherDetailModal'
import EmotionMarker from '../components/EmotionMarker'
import { entryKey } from '../utils/api'
import { EMOTIONS, COMPARE_COMMENTS, PROVINCE_MARKS } from '../data/mockData'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// 백엔드 연동 실패 시 fallback
const MOCK_REAL_WEATHER = {
  '서울': { weather: 'cloudy', temp: 17 }, '부산': { weather: 'sunny',  temp: 22 },
  '인천': { weather: 'rainy',  temp: 15 }, '대구': { weather: 'cloudy', temp: 19 },
  '광주': { weather: 'sunny',  temp: 20 }, '대전': { weather: 'storm',  temp: 16 },
  '울산': { weather: 'cloudy', temp: 18 }, '세종': { weather: 'cloudy', temp: 17 },
  '경기': { weather: 'sunny',  temp: 18 }, '강원': { weather: 'cloudy', temp: 14 },
  '충북': { weather: 'rainy',  temp: 16 }, '충남': { weather: 'sunny',  temp: 19 },
  '전북': { weather: 'cloudy', temp: 18 }, '전남': { weather: 'rainy',  temp: 17 },
  '경북': { weather: 'storm',  temp: 18 }, '경남': { weather: 'cloudy', temp: 19 },
  '제주': { weather: 'sunny',  temp: 23 },
}

function buildMock() {
  return PROVINCE_MARKS.map(mark => {
    const real = MOCK_REAL_WEATHER[mark.label] || { weather: 'sunny', temp: 20 }
    return {
      region: mark.label,
      real_weather: real.weather,
      real_temp: real.temp,
      emotion_weather: mark.emotion,
      match: real.weather === mark.emotion,
    }
  })
}

export default function ComparePage() {
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState(null)
  const [myRegion, setMyRegion] = useState(null)

  // 현재 신원의 오늘 마커에서 내가 찍은 지역을 읽어온다.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(entryKey())
      if (!raw) return
      const saved = JSON.parse(raw)
      const d = new Date()
      const today = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
      if (saved.date === today && saved.region) setMyRegion(saved.region)
    } catch {}
  }, [])

  useEffect(() => {
    async function loadComparisons() {
      try {
        const res = await fetch(`${API_URL}/api/emotions/compare/`)
        if (!res.ok) throw new Error('compare fetch failed')
        setData(await res.json())
      } catch {
        setData(buildMock())
      } finally {
        setLoading(false)
      }
    }

    loadComparisons()
  }, [])

  const filteredData = data
    .filter(item => item.region.includes(search))
    .sort((a, b) => (b.region === myRegion ? 1 : 0) - (a.region === myRegion ? 1 : 0))
  const matchCount = data.filter(item => item.match).length

  return (
    <div className="page-container">
      <SideMenu />

      {selectedItem && (
        <WeatherDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      <main className="page-content">


        <header className="page-header compare-header-row">
          <div>
            <h1 className="page-title">실제 날씨 vs 감정 날씨</h1>
            <p className="page-subtitle">
              기상청 실제 날씨와 사람들의 실시간 감정 평균 날씨를 비교 분석합니다.
            </p>
          </div>
          <div className="search-box">
            <input
              type="text"
              placeholder="지역 검색 (예: 서울, 제주)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </header>

        {loading ? (
          <div className="loading-state">
            <span className="location-dot loading" />
            <p>실시간 기상 데이터 불러오는 중...</p>
          </div>
        ) : (
          <>
            <div className="compare-summary-banner">
              📊 전국 {data.length}개 지역 중 <b>{matchCount}개</b> 지역에서 실제 기상과 사람들의 감정이 일치하고 있습니다.
            </div>

            <div className="compare-grid">
              {filteredData.length === 0 ? (
                <div className="no-results">검색 결과가 없습니다.</div>
              ) : (
                filteredData.map((item, idx) => {
                  const realEmo = EMOTIONS[item.real_weather] || EMOTIONS.sunny
                  const noData = !item.emotion_weather
                  const emoEmo  = EMOTIONS[item.emotion_weather] || EMOTIONS.sunny
                  const isMine = item.region === myRegion

                  return (
                    <article
                      key={idx}
                      className={`compare-card ${item.match ? 'match-card' : ''} ${isMine ? 'my-region-card' : ''}`}
                      onClick={() => setSelectedItem(item)}
                      style={{ cursor: 'pointer' }}
                    >
                      <h3 className="compare-card-title">
                        {item.region}
                        {isMine && <span className="my-region-badge">📍 내 지역</span>}
                      </h3>

                      <div className="compare-card-split">
                        <div className="compare-half real-half">
                          <span className="compare-label">실제 날씨</span>
                          <span className="compare-emoji">{realEmo.icon}</span>
                          <span className="compare-temp">{item.real_temp}°C</span>
                          <span className="compare-desc" style={{ color: realEmo.text }}>{realEmo.label}</span>
                        </div>

                        <div className="compare-divider" />

                        <div className="compare-half emotion-half">
                          <span className="compare-label">감정 날씨</span>
                          {noData ? (
                            <>
                              <HelpCircle size={44} color="#B8AEA0" strokeWidth={1.8} />
                              <span className="compare-desc" style={{ color: '#9A8F80' }}>데이터 없음</span>
                            </>
                          ) : (
                            <>
                              <EmotionMarker type={item.emotion_weather} size={44} />
                              <span className="compare-desc" style={{ color: emoEmo.text }}>{emoEmo.label}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <footer className={`compare-status ${noData ? 'nodata' : item.match ? 'match' : 'diff'}`}>
                        {noData
                          ? '아직 기록이 없어요 — 첫 감정 마크의 주인공이 되세요! 🌱'
                          : (COMPARE_COMMENTS[item.real_weather]?.[item.emotion_weather] ?? '')}
                      </footer>
                    </article>
                  )
                })
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
