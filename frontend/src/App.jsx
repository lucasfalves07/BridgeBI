import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AIThinking from './pages/AIThinking'
import Editor from './pages/Editor'
import History from './pages/History'

export default function App() {
  return (
    <Routes>
      <Route path="/"            element={<Login />} />
      <Route path="/dashboard"   element={<Dashboard />} />
      <Route path="/thinking"    element={<AIThinking />} />
      <Route path="/editor"      element={<Editor />} />
      <Route path="/history"     element={<History />} />
      <Route path="*"            element={<Navigate to="/" />} />
    </Routes>
  )
}
