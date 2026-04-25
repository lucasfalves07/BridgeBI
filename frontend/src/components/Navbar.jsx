import { useNavigate } from 'react-router-dom'
import { LogOut, History } from 'lucide-react'

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <header style={{
      padding: '0 24px', height: '56px',
      borderBottom: '1px solid rgba(255,215,0,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(18,18,18,0.95)',
      backdropFilter: 'blur(10px)',
      position: 'sticky', top: 0, zIndex: 10,
      animation: 'slideInL .4s both',
    }}>
      {/* Brand */}
      <div
        onClick={() => navigate('/dashboard')}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
          <path d="M 5 20 L 15 10 L 25 20 L 35 10" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M 5 30 L 15 20 L 25 30 L 35 20" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
        <span style={{ color: '#FFD700', fontSize: '20px', fontWeight: 400, letterSpacing: '1.5px' }}>
          BridgeBI
        </span>
      </div>

      {/* Nav buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => navigate('/history')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.5)', fontSize: '13px',
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            transition: 'color .2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#FFD700'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
        >
          <History size={16} /> Histórico
        </button>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.5)', fontSize: '13px',
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            transition: 'color .2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#FFD700'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
        >
          <LogOut size={16} /> Sair
        </button>
      </div>
    </header>
  )
}
