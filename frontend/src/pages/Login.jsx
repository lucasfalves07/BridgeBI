import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock } from 'lucide-react'
import NetworkBackground from '../components/NetworkBackground'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#121212',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      <NetworkBackground />

      {/* Card */}
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
          {/* Email */}
          <div style={{ position: 'relative', marginBottom: '16px', animation: 'slideInL .4s .5s both' }}>
            <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#FFD700' }} />
            <input
              type="text" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="E-mail ou Usuário"
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

          {/* Senha */}
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

          {/* Esqueceu */}
          <div style={{ textAlign: 'right', marginBottom: '18px', animation: 'fadeIn .4s .7s both' }}>
            <button type="button" style={{ background: 'none', border: 'none', color: '#FFD700', fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              Esqueceu a senha?
            </button>
          </div>

          {/* Entrar */}
          <button type="submit" style={{
            width: '100%', background: '#FFD700', color: '#121212',
            border: 'none', borderRadius: '8px', padding: '14px',
            fontSize: '14px', fontWeight: 600, letterSpacing: '1.5px',
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 20px rgba(255,215,0,0.2)',
            animation: 'fadeUp .4s .8s both',
            transition: 'opacity .2s',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            ENTRAR
          </button>
        </form>

        {/* Criar conta */}
        <div style={{ textAlign: 'center', marginTop: '14px', animation: 'fadeIn .4s .9s both' }}>
          <button style={{ background: 'none', border: 'none', color: '#FFD700', fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            Criar conta
          </button>
        </div>

        {/* Divisor */}
        <div style={{ position: 'relative', margin: '20px 0', animation: 'fadeIn .4s 1s both' }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.15)' }} />
          <span style={{ position: 'relative', background: '#1E1E1E', padding: '0 14px', color: 'rgba(255,255,255,0.5)', fontSize: '12px', display: 'block', width: 'fit-content', margin: '0 auto' }}>
            OU
          </span>
        </div>

        {/* Social */}
        <div style={{ animation: 'fadeIn .4s 1.1s both' }}>
          {[
            { label: 'Entrar com Google', icon: <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> },
            { label: 'Entrar com Microsoft', icon: <svg width="18" height="18" viewBox="0 0 23 23"><path fill="#f3f3f3" d="M0 0h23v23H0z"/><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg> },
          ].map(btn => (
            <button key={btn.label} type="button" style={{
              width: '100%', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.25)', borderRadius: '8px',
              padding: '13px', color: '#fff', fontSize: '13px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              marginBottom: '10px', fontFamily: 'Inter, sans-serif', transition: 'border-color .2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
            >
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
