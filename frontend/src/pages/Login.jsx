import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock } from 'lucide-react'
import NetworkBackground from '../components/NetworkBackground'
import { useTheme } from '../hooks/useTheme'
import API_URL from '../config'

export default function Login() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) { setError('Email ou senha inválidos'); setLoading(false); return }
      const user = await res.json()
      sessionStorage.setItem('bridgebi_user', JSON.stringify(user))
      navigate('/dashboard')
    } catch {
      setError('Erro ao conectar com o servidor')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px', position: 'relative', overflow: 'hidden', transition: 'background .3s',
    }}>
      <NetworkBackground />

      <button onClick={toggleTheme} style={{
        position: 'absolute', top: '16px', right: '16px',
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: '8px', padding: '8px 12px', cursor: 'pointer',
        color: 'var(--accent)', fontSize: '13px', display: 'flex',
        alignItems: 'center', gap: '6px', fontFamily: 'Inter, sans-serif', zIndex: 10,
      }}>
        {theme === 'light' ? '🌙 Escuro' : '☀️ Claro'}
      </button>

      <div style={{
        position: 'relative', zIndex: 10,
        background: 'var(--card)', borderRadius: '16px', padding: 'clamp(20px,5vw,32px)',
        width: '100%', maxWidth: '400px',
        border: '1px solid var(--border)', boxShadow: 'var(--shadow)', animation: 'fadeUp .5s both',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <svg width="70" height="70" viewBox="0 0 80 80" fill="none"
            style={{ display: 'block', margin: '0 auto 12px', animation: 'popIn .5s cubic-bezier(.175,.885,.32,1.275) .2s both' }}>
            <path d="M 20 15 L 20 65 L 45 65 C 55 65 60 60 60 50 C 60 45 57 40 50 40 C 57 40 60 35 60 30 C 60 20 55 15 45 15 Z"
              stroke="var(--accent)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M 20 40 L 48 40" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round"/>
            <path d="M 15 10 L 25 20 M 55 10 L 45 20 M 15 70 L 25 60 M 65 70 L 55 60"
              stroke="var(--accent)" strokeWidth="2" opacity="0.5" strokeLinecap="round"/>
          </svg>
          <h1 style={{ color: 'var(--text)', fontSize: 'clamp(20px,5vw,26px)', fontWeight: 600, letterSpacing: '1px', marginBottom: '4px' }}>BridgeBI</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Sua Ponte para Visualização Automatizada</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative', marginBottom: '14px' }}>
            <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent)' }} />
            <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail"
              style={{ width: '100%', background: 'var(--input-bg)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '8px', padding: '13px 14px 13px 44px', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
          <div style={{ position: 'relative', marginBottom: '18px' }}>
            <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent)' }} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha"
              style={{ width: '100%', background: 'var(--input-bg)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '8px', padding: '13px 14px 13px 44px', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px', marginBottom: '14px', color: '#ef4444', fontSize: '13px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', background: 'var(--accent)', color: '#fff', border: 'none',
            borderRadius: '8px', padding: '14px', fontSize: '14px', fontWeight: 600,
            letterSpacing: '1px', cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Inter, sans-serif', opacity: loading ? 0.7 : 1, transition: 'opacity .2s',
          }}>
            {loading ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>

        <div style={{ marginTop: '16px', padding: '12px', background: 'var(--accent-dim)', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '11px', textAlign: 'center', marginBottom: '4px' }}>Credenciais de demonstração</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center' }}>Admin: admin@bridgebi.com / admin123</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center' }}>Funcionário: funcionario@bridgebi.com / func123</p>
        </div>
      </div>
    </div>
  )
}