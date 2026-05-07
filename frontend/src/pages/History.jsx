import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, CheckCircle2, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'

export default function History() {
  const navigate = useNavigate()
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    const raw   = sessionStorage.getItem('bridgebi_user')
    const user  = raw ? JSON.parse(raw) : {}
    const email = user.email || ''
    const role  = user.role  || 'funcionario'
    const params = new URLSearchParams({ user_email: email, role })
    fetch(`/api/history?${params}`)
      .then(r => { if (!r.ok) throw new Error('Erro ao buscar histórico'); return r.json() })
      .then(data => { setItems(data); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  const handleReuse = (sql) => {
    sessionStorage.setItem('bridgebi_result', JSON.stringify({ sql, tables: [], explanation: 'Consulta reutilizada do histórico.' }))
    navigate('/editor')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', transition: 'background .3s' }}>
      <Navbar />
      <div style={{ flex: 1, padding: '24px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>

        <div style={{ marginBottom: '24px', animation: 'fadeIn .4s both' }}>
          <h2 style={{ color: 'var(--accent)', fontSize: '22px', fontWeight: 600, marginBottom: '4px' }}>Histórico de Consultas</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Todas as perguntas feitas ao BridgeBI</p>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px', display: 'block' }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            Carregando histórico...
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '16px', color: '#ef4444', fontSize: '13px' }}>
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <Clock size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: .4 }} />
            <p>Nenhuma consulta ainda.</p>
            <button onClick={() => navigate('/dashboard')} style={{ marginTop: '16px', background: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 20px', color: 'var(--accent)', fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              Fazer primeira consulta
            </button>
          </div>
        )}

        {!loading && items.map((item, i) => {
          const date   = new Date(item.created_at).toLocaleString('pt-BR')
          const tables = item.tables ? item.tables.split(', ').filter(Boolean) : []
          return (
            <div key={item.id} style={{
              background: 'var(--card)', border: '1px solid var(--border2)',
              borderRadius: '10px', padding: '18px 20px', marginBottom: '12px',
              animation: `fadeUp .4s ${i * 0.05}s both`, transition: 'border-color .2s, box-shadow .2s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = 'var(--shadow)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'var(--text)', fontSize: '14px', marginBottom: '8px', lineHeight: 1.4 }}>{item.question}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981', fontSize: '12px' }}>
                      <CheckCircle2 size={12} /> {item.status}
                    </div>
                    {item.user_email && (
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>👤 {item.user_email}</span>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '12px' }}>
                      <Clock size={12} /> {date}
                    </div>
                    {tables.map(t => (
                      <span key={t} style={{ background: 'var(--accent-dim)', border: '1px solid var(--border)', borderRadius: '4px', padding: '1px 7px', fontSize: '11px', color: 'var(--accent)' }}>{t}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => handleReuse(item.sql)} style={{
                  flexShrink: 0, background: 'none', border: '1px solid var(--border)',
                  borderRadius: '8px', padding: '8px 12px', color: 'var(--accent)', fontSize: '12px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                  fontFamily: 'Inter, sans-serif', transition: 'background .2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-dim)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  Ver script <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
