import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

const STEPS = [
  'Identificando intenção de negócio...',
  'Consultando Dicionário de Dados...',
  'Mapeando tabelas identificadas...',
  'Mapeando relacionamentos...',
  'Validando integridade dos dados...',
  'Script gerado com sucesso!',
]

const NODES = [
  { id: 'MSEG', label: 'Movimentação', cx: 60,  cy: 90 },
  { id: 'EKPO', label: 'Compras',      cx: 150, cy: 36 },
  { id: 'MARA', label: 'Material',     cx: 240, cy: 90 },
]

const CONNS = [[0,1],[1,2],[0,2]]

export default function AIThinking() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [step, setStep]           = useState(0)
  const [done, setDone]           = useState(false)
  const [error, setError]         = useState(null)
  const [showNodes, setShowNodes] = useState(false)
  const [showConns, setShowConns] = useState(false)

  useEffect(() => {
    const question  = sessionStorage.getItem('bridgebi_question') || 'Consulta de movimentação de materiais'
    const user      = JSON.parse(sessionStorage.getItem('bridgebi_user') || '{}')
    const userEmail = user.email || ''

    let current = 0
    const interval = setInterval(() => {
      current++
      setStep(current)
      if (current === 3) setShowNodes(true)
      if (current === 4) setShowConns(true)
      if (current >= STEPS.length) clearInterval(interval)
    }, 1000)

    fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, user_email: userEmail }),
    })
      .then(r => r.json())
      .then(result => {
        sessionStorage.setItem('bridgebi_result', JSON.stringify(result))
        setTimeout(() => setDone(true), STEPS.length * 1000 + 500)
      })
      .catch(err => { setError(err.message); clearInterval(interval) })

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '24px', transition: 'background .3s' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <div style={{ marginBottom: '24px', animation: 'fadeIn .4s both' }}>
          <h2 style={{ color: 'var(--accent)', fontSize: '22px', fontWeight: 600, marginBottom: '6px' }}>Processando Requisição</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Conectando os pontos nos seus dados...</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '16px', marginBottom: '20px', color: '#ef4444' }}>
            ⚠️ Erro: {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: 'var(--card)', borderRadius: '10px', border: '1px solid var(--border)', padding: '24px', animation: 'slideInL .4s both', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              <span style={{ color: 'var(--text)', fontSize: '14px', fontWeight: 500 }}>Log de Descoberta</span>
            </div>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px', opacity: i <= step ? 1 : 0.3, transition: 'opacity .3s' }}>
                <div style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {i < step
                    ? <CheckCircle2 size={18} style={{ color: 'var(--accent)' }} />
                    : i === step
                      ? <div style={{ width: '10px', height: '10px', background: 'var(--accent)', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
                      : <div style={{ width: '10px', height: '10px', border: '2px solid var(--border)', borderRadius: '50%' }} />
                  }
                </div>
                <span style={{ fontSize: '13px', color: i <= step ? 'var(--text)' : 'var(--text-muted)', lineHeight: 1.4 }}>{s}</span>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--card)', borderRadius: '10px', border: '1px solid var(--border)', padding: '24px', animation: 'slideInR .4s both', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ color: 'var(--text)', fontSize: '14px', fontWeight: 500, marginBottom: '16px' }}>Mapa de Relacionamentos</div>
            <div style={{ background: 'var(--bg3)', borderRadius: '8px', height: '180px', border: '1px solid var(--border2)' }}>
              <svg width="100%" height="100%" viewBox="0 0 300 180">
                {CONNS.map(([a,b], i) => (
                  <line key={i} x1={NODES[a].cx} y1={NODES[a].cy} x2={NODES[b].cx} y2={NODES[b].cy}
                    stroke="#10B981" strokeWidth="2" strokeDasharray="6 4"
                    opacity={showConns ? 0.6 : 0} style={{ transition: `opacity .4s ${i * 0.2}s` }}
                  />
                ))}
                {NODES.map((n, i) => (
                  <g key={n.id}>
                    <circle cx={n.cx} cy={n.cy} r={showNodes ? 20 : 0} fill="#10B981" style={{ transition: `r .3s ${i * 0.15}s` }}/>
                    <text x={n.cx} y={n.cy} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="10" fontWeight="bold" opacity={showNodes ? 1 : 0} style={{ transition: `opacity .3s ${i * 0.15 + 0.2}s` }}>{n.id}</text>
                    <text x={n.cx} y={n.cy + (n.cy < 90 ? 30 : -30)} textAnchor="middle" fill="#10B981" fontSize="11" opacity={showNodes ? 1 : 0} style={{ transition: `opacity .3s ${i * 0.15 + 0.2}s` }}>{n.label}</text>
                  </g>
                ))}
              </svg>
            </div>
            <div style={{ height: '3px', marginTop: '16px', background: 'linear-gradient(to right, transparent, #10B981, transparent)', borderRadius: '2px', width: done ? '100%' : '0', transition: 'width 1s ease' }} />
            {done && (
              <button onClick={() => navigate('/editor')} style={{
                width: '100%', marginTop: '14px', background: 'var(--accent)', color: '#fff',
                border: 'none', borderRadius: '8px', padding: '13px', fontSize: '14px',
                fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '8px', fontFamily: 'Inter, sans-serif',
                animation: 'fadeUp .4s both', transition: 'opacity .2s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Ver Script Gerado <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
