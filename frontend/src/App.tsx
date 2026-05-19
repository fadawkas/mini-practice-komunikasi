import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PracticePage from './pages/PracticePage'
import AdminPage from './pages/AdminPage'

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/practice/komunikasi-internal-2026" replace />} />
      <Route path="/practice/:sessionCode" element={<PracticePage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}

export default App