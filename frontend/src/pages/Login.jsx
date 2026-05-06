import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock } from 'lucide-react'
import NetworkBackground from '../components/NetworkBackground'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        setError('Email ou senha inválidos')
        setLoading(false)
        return
      }
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
      minHeight: '100vh', background: '#121212',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      <NetworkBackground />

      <div style={{
        position: 'relative', zIndex: 10,
        background: '#1E1E1E', borderRadius: '16px', padding: '32px',
        width: '100%', maxWidth: '400px',
        border: '1px solid rgba(255,215,0,0.2)',
        boxShadow: '0 25px 50px rgba(255,215,0,0.1)',
        animation: 'fadeUp .5s both',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none"
            style={{ display: 'block', margin: '0 auto 12px', animation: 'popIn .5s cubic-bezier(.175,.885,.32,1.275) .2s both' }}>
            <path d="M 20 15 L 20 65 L 45 65 C 55 65 60 60 60 50 C 60 45 57 40 50 40 C 57 40 60 35 60 30 C 60 20 55 15 45 15 Z"
              stroke="#FFD700" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M 20 40 L 48 40" stroke="#FFD700" strokeWidth="3" strokeLinecap="round"/>
            <path d="M 15 10 L 25 20 M 55 10 L 45 20 M 15 70 L 25 60 M 65 70 L 55 60"
              stroke="#FFD700" strokeWidth="2" opacity="0.5" strokeLinecap="round"/>
          </svg>
          <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: 400, letterSpacing: '2px', marginBottom: '4px', animation: 'fadeIn .4s .3s both' }}>
            BridgeBI
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', animation: 'fadeIn .4s .4s both' }}>
            Sua Ponte para Visualização Automatizada
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative', marginBottom: '16px', animation: 'slideInL .4s .5s both' }}>
            <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#FFD700' }} />
            <input
              type="text" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="E-mail"
              style={{
                width: '100%', background: '#2C2C2C', color: '#fff',
                border: '1px solid rgba(255,215,0,0.3)', borderRadius: '8px',
                padding: '13px 14px 13px 44px', fontSize: '14px',
                fontFamily: 'Inter, sans-serif', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = '#FFD700'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,215,0,0.3)'}
            />
          </div>

          <div style={{ position: 'relative', marginBottom: '12px', animation: 'slideInL .4s .6s both' }}>
            <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#FFD700' }} />
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Senha"
              style={{
                width: '100%', background: '#2C2C2C', color: '#fff',
                border: '1px solid rgba(255,215,0,0.3)', borderRadius: '8px',
                padding: '13px 14px 13px 44px', fontSize: '14px',
                fontFamily: 'Inter, sans-serif', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = '#FFD700'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,215,0,0.3)'}
            />
          </div>

          {error && (
            <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: '8px', padding: '10px', marginBottom: '14px', color: '#ff8080', fontSize: '13px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', background: '#FFD700', color: '#121212',
            border: 'none', borderRadius: '8px', padding: '14px',
            fontSize: '14px', fontWeight: 600, letterSpacing: '1.5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Inter, sans-serif',
            opacity: loading ? 0.7 : 1,
            animation: 'fadeUp .4s .8s both', transition: 'opacity .2s',
          }}>
            {loading ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>

        <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(255,215,0,0.05)', borderRadius: '8px', border: '1px solid rgba(255,215,0,0.1)' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textAlign: 'center', marginBottom: '6px' }}>Credenciais de demonstração</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textAlign: 'center' }}>
            Admin: admin@bridgebi.com / admin123
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textAlign: 'center' }}>
            Funcionário: funcionario@bridgebi.com / func123
          </p>
        </div>
      </div>
    </div>
  )
}