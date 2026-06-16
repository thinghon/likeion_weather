import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './pages/MainPage'
import InsightsPage from './pages/InsightsPage'
import JournalPage from './pages/JournalPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<MainPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/journal"  element={<JournalPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
