import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppRouter } from './routes/AppRouter'
import { AdminRouter } from './routes/AdminRouter'

const App: React.FC = () => {
  return (
    <Routes>
      {/* Admin routes */}
      <Route path="/admin/*" element={<AdminRouter />} />
      {/* Public routes */}
      <Route path="/*" element={<AppRouter />} />
    </Routes>
  )
}

export default App