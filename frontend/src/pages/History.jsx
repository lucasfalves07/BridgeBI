import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, CheckCircle2, AlertCircle, Star, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import { getHistory } from '../services/api'

const STATUS_STYLE = {
  gerado: { color: '#4ade80', icon: <CheckCircle2 size={14} /> },
  erro:   { color: '#f87171', icon: <AlertCircle  size={14} /> },
}

export default function History() {
  const navigate = useNavigate()
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    getHistory()
      .then(data => { setItems(data); setLoading(false) })
      .catch(() => { setError('Não foi possível carregar o histórico. Verifique se o backend está rodando.'); setLoading(false) })
  }, [])

  const handleReuse = (question, sql) => {
    sessionStorage.setItem('bridgebi_result', JSON.stringify({ sql, tables: [], explanation: 'Consulta reutilizada do histórico.' }))
    navigate('/editor')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#121212', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ flex: 1, padding: '24px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px', animation: 'fadeIn .4s both' }}>
          <h2 style={{ color: '#FFD700', fontSize: '22px', fontWeight: 400, marginBottom: '4px' }}>Histórico de Consultas</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Todas as perguntas feitas ao BridgeBI</p>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.4)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px', display: 'block' }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            Carregando histórico...
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: '8px', padding: '16px', color: '#ff8080', fontSize: '13px' }}>
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.3)' }}>
            <Clock size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: .4 }} />
            <p>Nenhuma consulta ainda.</p>
            <button onClick={() => navigate('/dashboard')} style={{ marginTop: '16px', background: 'none', border: '1px solid rgba(255,215,0,0.3)', borderRadius: '8px', padding: '10px 20px', color: '#FFD700', fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              Fazer primeira consulta
            </button>
          </div>
        )}

        {!loading && items.map((item, i) => {
          const st = STATUS_STYLE[item.status] || STATUS_STYLE.gerado
          const date = new Date(item.created_at).toLocaleString('pt-BR')
          const tables = item.tables ? item.tables.split(', ').filter(Boolean) : []

          return (
            <div key={item.id} style={{
              background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '10px', padding: '18px 20px', marginBottom: '12px',
              animation: `fadeUp .4s ${i * 0.05}s both`,
              transition: 'border-color .2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  {/* Question */}
                  <p style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', lineHeight: 1.4 }}>
                    {item.question}
                  </p>

                  {/* Meta row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    {/* Status */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: st.color, fontSize: '12px' }}>
                      {st.icon} {item.status}
                    </div>

                    {/* Date */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>
                      <Clock size={12} /> {date}
                    </div>

                    {/* Tables */}
                    {tables.map(t => (
                      <span key={t} style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '4px', padding: '1px 7px', fontSize: '11px', color: 'rgba(255,215,0,0.7)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Reuse button */}
                <button onClick={() => handleReuse(item.question, item.sql)} style={{
                  flexShrink: 0, background: 'none', border: '1px solid rgba(255,215,0,0.25)',
                  borderRadius: '8px', padding: '8px 12px', color: '#FFD700', fontSize: '12px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                  fontFamily: 'Inter, sans-serif', transition: 'background .2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,215,0,0.08)'}
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
