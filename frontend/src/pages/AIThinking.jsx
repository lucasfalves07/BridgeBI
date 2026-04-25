import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { generateSQL } from '../services/api'

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
  const [step, setStep]     = useState(0)
  const [done, setDone]     = useState(false)
  const [error, setError]   = useState(null)
  const [showNodes, setShowNodes] = useState(false)
  const [showConns, setShowConns] = useState(false)

  useEffect(() => {
    const question = sessionStorage.getItem('bridgebi_question') || 'Consulta de movimentação de materiais'

    // Avança steps visualmente a cada 1s
    let current = 0
    const interval = setInterval(() => {
      current++
      setStep(current)
      if (current === 3) setShowNodes(true)
      if (current === 4) setShowConns(true)
      if (current >= STEPS.length) clearInterval(interval)
    }, 1000)

    // Chama a API em paralelo
    generateSQL(question)
      .then(result => {
        sessionStorage.setItem('bridgebi_result', JSON.stringify(result))
        // Espera animação terminar antes de mostrar botão
        setTimeout(() => setDone(true), STEPS.length * 1000 + 500)
      })
      .catch(err => {
        setError(err.message)
        clearInterval(interval)
      })

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#121212', padding: '24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px', animation: 'fadeIn .4s both' }}>
          <h2 style={{ color: '#FFD700', fontSize: '22px', fontWeight: 400, marginBottom: '6px' }}>
            Processando Requisição
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
            Conectando os pontos nos seus dados...
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: '8px', padding: '16px', marginBottom: '20px', color: '#ff8080' }}>
            ⚠️ Erro: {error} — verifique se o backend está rodando e a chave do Groq está configurada.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

          {/* LOG */}
          <div style={{
            background: '#2C2C2C', borderRadius: '8px',
            border: '1px solid rgba(255,215,0,0.2)', padding: '24px',
            animation: 'slideInL .4s both',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"
                style={{ animation: 'spin 1s linear infinite' }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              <span style={{ color: '#fff', fontSize: '14px' }}>Log de Descoberta</span>
            </div>

            {STEPS.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                marginBottom: '12px',
                opacity: i <= step ? 1 : 0.25,
                transition: 'opacity .3s',
              }}>
                <div style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {i < step
                    ? <CheckCircle2 size={18} style={{ color: '#FFD700' }} />
                    : i === step
                      ? <div style={{ width: '10px', height: '10px', background: '#FFD700', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
                      : <div style={{ width: '10px', height: '10px', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '50%' }} />
                  }
                </div>
                <span style={{ fontSize: '13px', color: i <= step ? '#fff' : 'rgba(255,255,255,0.3)', lineHeight: 1.4 }}>{s}</span>
              </div>
            ))}
          </div>

          {/* MAP */}
          <div style={{
            background: '#2C2C2C', borderRadius: '8px',
            border: '1px solid rgba(255,215,0,0.2)', padding: '24px',
            animation: 'slideInR .4s both',
          }}>
            <div style={{ color: '#fff', fontSize: '14px', marginBottom: '16px' }}>Mapa de Relacionamentos</div>
            <div style={{ background: '#1a1a1a', borderRadius: '8px', height: '180px' }}>
              <svg width="100%" height="100%" viewBox="0 0 300 180">
                {CONNS.map(([a,b], i) => (
                  <line key={i}
                    x1={NODES[a].cx} y1={NODES[a].cy}
                    x2={NODES[b].cx} y2={NODES[b].cy}
                    stroke="#FFD700" strokeWidth="2"
                    strokeDasharray="6 4"
                    opacity={showConns ? 0.5 : 0}
                    style={{ transition: `opacity .4s ${i * 0.2}s` }}
                  />
                ))}
                {NODES.map((n, i) => (
                  <g key={n.id}>
                    <circle cx={n.cx} cy={n.cy}
                      r={showNodes ? 20 : 0}
                      fill="#FFD700"
                      style={{ transition: `r .3s ${i * 0.15}s` }}
                    />
                    <text x={n.cx} y={n.cy} textAnchor="middle" dominantBaseline="middle"
                      fill="#121212" fontSize="10" fontWeight="bold"
                      opacity={showNodes ? 1 : 0}
                      style={{ transition: `opacity .3s ${i * 0.15 + 0.2}s` }}>
                      {n.id}
                    </text>
                    <text x={n.cx} y={n.cy + (n.cy < 90 ? 30 : -30)} textAnchor="middle"
                      fill="#FFD700" fontSize="11"
                      opacity={showNodes ? 1 : 0}
                      style={{ transition: `opacity .3s ${i * 0.15 + 0.2}s` }}>
                      {n.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Bridge line */}
            <div style={{
              height: '3px', marginTop: '16px',
              background: 'linear-gradient(to right, transparent, #FFD700, transparent)',
              borderRadius: '2px',
              width: done ? '100%' : '0',
              transition: 'width 1s ease',
            }} />

            {done && (
              <button
                onClick={() => navigate('/editor')}
                style={{
                  width: '100%', marginTop: '14px',
                  background: '#FFD700', color: '#121212', border: 'none',
                  borderRadius: '8px', padding: '13px',
                  fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  fontFamily: 'Inter, sans-serif', animation: 'fadeUp .4s both',
                  transition: 'opacity .2s',
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
