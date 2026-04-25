import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Copy, Check, Download, Database, Cloud } from 'lucide-react'
import Navbar from '../components/Navbar'

const KEYWORDS = ['SELECT','FROM','WHERE','INNER JOIN','LEFT JOIN','ORDER BY','ON','AND','IN','AS','GROUP BY','HAVING','DISTINCT']

function highlightSQL(line) {
  if (line.trim().startsWith('--')) {
    return <span style={{ color: 'rgba(255,215,0,0.55)' }}>{line}</span>
  }
  const parts = []
  let remaining = line
  const regex = new RegExp(`\\b(${KEYWORDS.join('|')})\\b`, 'g')
  let last = 0, match
  while ((match = regex.exec(line)) !== null) {
    if (match.index > last) parts.push(<span key={last} style={{ color: 'rgba(255,255,255,0.85)' }}>{line.slice(last, match.index)}</span>)
    parts.push(<span key={match.index} style={{ color: '#FFD700', fontWeight: 500 }}>{match[0]}</span>)
    last = match.index + match[0].length
  }
  if (last < line.length) parts.push(<span key={last} style={{ color: 'rgba(255,255,255,0.85)' }}>{line.slice(last)}</span>)
  return parts.length ? parts : <span style={{ color: 'rgba(255,255,255,0.85)' }}>{line}</span>
}

const CHECKS = [
  { label: 'Colunas de valores corretas', ok: true },
  { label: 'Joins otimizados',            ok: true },
  { label: 'Filtros de data aplicados',   ok: true },
  { label: 'Performance validada',        ok: false },
]

const EXPORT_OPTS = [
  { icon: Download, label: 'Power BI',      desc: 'Importar para Power BI Desktop' },
  { icon: Database, label: 'CSV Export',    desc: 'Baixar como arquivo CSV' },
  { icon: Cloud,    label: 'Cloud Storage', desc: 'Enviar para Azure/AWS' },
]

export default function Editor() {
  const navigate = useNavigate()
  const [copied, setCopied]     = useState(false)
  const [showModal, setShowModal] = useState(false)

  const raw = sessionStorage.getItem('bridgebi_result')
  const result = raw ? JSON.parse(raw) : null
  const sql = result?.sql || '-- Nenhum script disponível.\n-- Volte ao dashboard e faça uma consulta.'

  const handleCopy = () => {
    navigator.clipboard.writeText(sql).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#121212', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ flex: 1, padding: '24px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', animation: 'fadeIn .4s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#FFD700', cursor: 'pointer', display: 'flex' }}>
              <ArrowLeft size={22} />
            </button>
            <div>
              <h2 style={{ color: '#FFD700', fontSize: '20px', fontWeight: 400 }}>Script Gerado</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '2px' }}>Revise e exporte sua análise</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#2C2C2C', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '8px', padding: '8px 12px' }}>
            <Database size={14} style={{ color: '#FFD700' }} />
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>HANA DB</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>

          {/* CODE PANEL */}
          <div style={{ background: '#0a0a0a', borderRadius: '8px', border: '1px solid rgba(255,215,0,0.2)', overflow: 'hidden', animation: 'slideInL .4s both' }}>
            {/* Bar */}
            <div style={{ background: '#1a1a1a', borderBottom: '1px solid rgba(255,215,0,0.2)', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {['#ff5f56','#ffbd2e','#27c93f'].map((c,i) => <div key={i} style={{ width: '11px', height: '11px', borderRadius: '50%', background: c }} />)}
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginLeft: '10px' }}>query.sql</span>
              </div>
              <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#FFD700', fontSize: '12px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                {copied ? <><Check size={13}/> Copiado!</> : <><Copy size={13}/> Copiar</>}
              </button>
            </div>

            {/* Code */}
            <div style={{ padding: '20px', overflowX: 'auto' }}>
              {sql.split('\n').map((line, i) => (
                <div key={i} style={{ display: 'flex', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', lineHeight: '1.8' }}>
                  <span style={{ color: 'rgba(255,255,255,0.2)', width: '36px', flexShrink: 0, textAlign: 'right', paddingRight: '16px', userSelect: 'none' }}>{i + 1}</span>
                  <span>{highlightSQL(line) || '\u00a0'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SIDE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* Explanation */}
            {result?.explanation && (
              <div style={{ background: '#2C2C2C', borderRadius: '8px', border: '1px solid rgba(255,215,0,0.2)', padding: '16px', animation: 'slideInR .4s both' }}>
                <p style={{ color: '#FFD700', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.5px' }}>Sobre este script</p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: 1.5 }}>{result.explanation}</p>
                {result.tables?.length > 0 && (
                  <div style={{ marginTop: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {result.tables.map(t => (
                      <span key={t} style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.25)', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', color: '#FFD700' }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Validation */}
            <div style={{ background: '#2C2C2C', borderRadius: '8px', border: '1px solid rgba(255,215,0,0.2)', padding: '20px', animation: 'slideInR .4s .1s both' }}>
              <p style={{ color: '#fff', fontSize: '14px', marginBottom: '14px' }}>Validação</p>
              {CHECKS.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '3px', border: c.ok ? 'none' : '1.5px solid rgba(255,215,0,0.4)', background: c.ok ? '#FFD700' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {c.ok && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#121212" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <span style={{ fontSize: '13px', color: c.ok ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)' }}>{c.label}</span>
                </div>
              ))}
            </div>

            {/* Export */}
            <button onClick={() => setShowModal(true)} style={{
              width: '100%', background: '#FFD700', color: '#121212', border: 'none',
              borderRadius: '8px', padding: '14px', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontFamily: 'Inter, sans-serif', animation: 'fadeUp .4s .4s both', transition: 'opacity .2s',
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <Download size={18} /> Gerar Visualização
            </button>

            {/* Risk */}
            <div style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.25)', borderRadius: '8px', padding: '14px', animation: 'fadeIn .4s .5s both' }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', lineHeight: 1.5 }}>
                ⚠️ <strong style={{ color: '#FFD700' }}>Atenção:</strong> Sempre revise a lógica antes de aplicar em produção
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px', zIndex: 50, animation: 'fadeIn .2s both',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#2C2C2C', borderRadius: '10px',
            border: '1px solid rgba(255,215,0,0.3)',
            padding: '28px', width: '100%', maxWidth: '380px',
            animation: 'fadeUp .2s both',
          }}>
            <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: 400, marginBottom: '20px' }}>Selecione o Destino</h3>
            {EXPORT_OPTS.map((opt, i) => (
              <button key={opt.label} style={{
                width: '100%', background: '#1a1a1a',
                border: '1px solid rgba(255,215,0,0.2)', borderRadius: '8px',
                padding: '14px', marginBottom: '10px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '12px',
                fontFamily: 'Inter, sans-serif', transition: 'background .2s, border-color .2s',
                animation: `fadeUp .3s ${i * 0.1}s both`,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,215,0,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,215,0,0.5)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)' }}
              >
                <opt.icon size={20} style={{ color: '#FFD700', flexShrink: 0 }} />
                <div style={{ textAlign: 'left' }}>
                  <p style={{ color: '#fff', fontSize: '14px' }}>{opt.label}</p>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', marginTop: '2px' }}>{opt.desc}</p>
                </div>
              </button>
            ))}
            <button onClick={() => setShowModal(false)} style={{ width: '100%', marginTop: '6px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '13px', cursor: 'pointer', padding: '8px', fontFamily: 'Inter, sans-serif', transition: 'color .2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
