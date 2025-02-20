import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from '@/features/home/pages/HomePage'
import { DiagnosticPage } from '@/features/diagnostic/pages/DiagnosticPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/diagnostic" element={<DiagnosticPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
