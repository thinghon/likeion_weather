import { useNavigate } from 'react-router-dom'

export default function JournalPage() {
  const navigate = useNavigate()
  return (
    <div className="placeholder-page">
      <span style={{ fontSize: 48 }}>📓</span>
      <h1>My Journal</h1>
      <p>나의 감정 기록 — 추후 구현 예정</p>
      <button className="placeholder-back" onClick={() => navigate('/')}>
        ← Live Map으로 돌아가기
      </button>
    </div>
  )
}
