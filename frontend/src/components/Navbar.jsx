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
        <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="20" r="10" fill="none" stroke="var(--accent)" strokeWidth="5"/>
          <circle cx="15" cy="75" r="10" fill="none" stroke="var(--accent)" strokeWidth="5"/>
          <circle cx="85" cy="75" r="10" fill="none" stroke="var(--accent)" strokeWidth="5"/>
          <line x1="43" y1="28" x2="22" y2="67" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round"/>
          <line x1="57" y1="28" x2="78" y2="67" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round"/>
          <line x1="25" y1="75" x2="75" y2="75" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round"/>
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
