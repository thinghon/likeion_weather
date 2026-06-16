import { useState, useEffect } from 'react'
import KoreaMap from '../components/KoreaMap'
import SideMenu from '../components/SideMenu'
import EmotionModal from '../components/EmotionModal'
import { PROVINCE_MARKS, INDIVIDUAL_MARKS } from '../data/mockData'

function getToday() {
  return new Date().toISOString().slice(0, 10)
}

export default function MainPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [userMarks, setUserMarks] = useState([])

  useEffect(() => {
    const raw = sessionStorage.getItem('mwm_entry')
    if (!raw) return
    try {
      const saved = JSON.parse(raw)
      if (saved.date === getToday() && saved.latitude && saved.longitude) {
        setUserMarks([{
          id: 'user-today',
          coordinates: [saved.longitude, saved.latitude],
          emotion: saved.emotion,
          comment: saved.comment || '',
          timestamp: saved.timestamp || Date.now(),
          region: '내 위치',
        }])
      }
    } catch { /* ignore */ }
  }, [])

  const handleSubmit = (entry) => {
    if (!entry.latitude || !entry.longitude) return
    setUserMarks([{
      id: 'user-today',
      coordinates: [entry.longitude, entry.latitude],
      emotion: entry.emotion,
      comment: entry.comment || '',
      timestamp: Date.now(),
      region: '내 위치',
    }])
  }

  return (
    <div className="main-page">
      <KoreaMap
        provinceMasks={PROVINCE_MARKS}
        individualMarks={INDIVIDUAL_MARKS}
        userMarks={userMarks}
      />
      <SideMenu />
      <button className="fab" onClick={() => setModalOpen(true)}>+</button>
      <EmotionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
