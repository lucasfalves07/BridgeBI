import { useNavigate } from 'react-router-dom'
import { LogOut, History, Shield, Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export default function Navbar() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const user = JSON.parse(sessionStorage.getItem('bridgebi_user') || '{}')

  const btnStyle = {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: 'none', border: 'none',
    color: 'var(--text-muted)', fontSize: '13px',
    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
    transition: 'color .2s',
  }

  return (
    <header style={{
      padding: '0 24px', height: '56px',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'var(--card)',
      backdropFilter: 'blur(10px)',
      position: 'sticky', top: 0, zIndex: 10,
      boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      animation: 'slideInL .4s both',
    }}>
      <div onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
        <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
          <path d="M 5 20 L 15 10 L 25 20 L 35 10" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M 5 30 L 15 20 L 25 30 L 35 20" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
        <span style={{ color: 'var(--accent)', fontSize: '20px', fontWeight: 600, letterSpacing: '1px' }}>BridgeBI</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {user.name && (
          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
            {user.role === 'admin' ? '👑' : '👤'} {user.name}
          </span>
        )}
        {user.role === 'admin' && (
          <button onClick={() => navigate('/admin')} style={btnStyle}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <Shield size={16} /> Admin
          </button>
        )}
        <button onClick={() => navigate('/history')} style={btnStyle}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <History size={16} /> Histórico
        </button>
        <button onClick={toggleTheme} style={{ ...btnStyle, padding: '6px', borderRadius: '8px', background: 'var(--accent-dim)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-glow)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--accent-dim)'}
        >
          {theme === 'light' ? <Moon size={16} style={{ color: 'var(--accent)' }}/> : <Sun size={16} style={{ color: 'var(--accent)' }}/>}
        </button>
        <button onClick={() => { sessionStorage.clear(); navigate('/') }} style={btnStyle}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <LogOut size={16} /> Sair
        </button>
      </div>
    </header>
  )
}
