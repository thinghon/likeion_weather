import { useNavigate } from 'react-router-dom'

export default function InsightsPage() {
  const navigate = useNavigate()
  return (
    <div className="placeholder-page">
      <span style={{ fontSize: 48 }}>📊</span>
      <h1>Insights</h1>
      <p>전국 감정 통계 — 추후 구현 예정</p>
      <button className="placeholder-back" onClick={() => navigate('/')}>
        ← Live Map으로 돌아가기
      </button>
    </div>
  )
}
