export default function EmotionCard({ emotion, selected, onSelect }) {
  const selectedStyle = selected
    ? { borderColor: emotion.border, backgroundColor: emotion.color, color: emotion.text }
    : {}

  return (
    <button
      type="button"
      className={`emotion-card ${selected ? 'selected' : ''}`}
      style={selectedStyle}
      onClick={() => onSelect(emotion.id)}
    >
      <span className="emotion-card-icon">{emotion.icon}</span>
      <span className="emotion-card-label">{emotion.label}</span>
    </button>
  )
}
