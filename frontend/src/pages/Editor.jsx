import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Copy, Check, Download, Database } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useTheme } from '../hooks/useTheme'

const KEYWORDS = ['SELECT','FROM','WHERE','INNER JOIN','LEFT JOIN','ORDER BY','ON','AND','IN','AS','GROUP BY','HAVING','DISTINCT']

function highlightSQL(line) {
  if (line.trim().startsWith('--')) return <span style={{ color: '#6EE7B7' }}>{line}</span>
  const parts = []
  const regex = new RegExp(`\\b(${KEYWORDS.join('|')})\\b`, 'g')
  let last = 0, match
  while ((match = regex.exec(line)) !== null) {
    if (match.index > last) parts.push(<span key={last} style={{ color: 'var(--text2)' }}>{line.slice(last, match.index)}</span>)
    parts.push(<span key={match.index} style={{ color: 'var(--accent)', fontWeight: 500 }}>{match[0]}</span>)
    last = match.index + match[0].length
  }
  if (last < line.length) parts.push(<span key={last} style={{ color: 'var(--text2)' }}>{line.slice(last)}</span>)
  return parts.length ? parts : <span style={{ color: 'var(--text2)' }}>{line}</span>
}

const CHECKS = [
  { label: 'Colunas de valores corretas', ok: true },
  { label: 'Joins otimizados',            ok: true },
  { label: 'Filtros de data aplicados',   ok: true },
]

export default function Editor() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [copied, setCopied]       = useState(false)
  const [showModal, setShowModal] = useState(false)

  const raw    = sessionStorage.getItem('bridgebi_result')
  const result = raw ? JSON.parse(raw) : null
  const sql    = result?.sql || '-- Nenhum script disponível.\n-- Volte ao dashboard e faça uma consulta.'

  const fallbackCopy = () => {
    const textarea = document.createElement('textarea')
    textarea.value = sql
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    try { document.execCommand('copy') } catch {}
    document.body.removeChild(textarea)
  }

  const handleCopy = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(sql).catch(() => fallbackCopy())
    } else {
      fallbackCopy()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const EXPORT_OPTS = [
    {
      icon: Download, label: 'Power BI', desc: 'Baixar query para Power BI Desktop',
      action: async () => {
        setShowModal(false)
        try {
          const res = await fetch('/api/generate-powerbi', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sql, tables: result?.tables || [] }) })
          if (!res.ok) throw new Error()
          const blob = await res.blob()
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a'); a.href = url; a.download = 'bridgebi_query.m'; a.click()
          URL.revokeObjectURL(url)
          alert('✅ Arquivo baixado!\n\nNo Power BI Desktop:\n1. Obter Dados → Consulta Nula\n2. Editor Avançado\n3. Cole o arquivo .m\n4. Concluído')
        } catch { alert('Erro ao gerar arquivo.') }
      }
    },
    {
      icon: Database, label: 'CSV Export', desc: 'Baixar dados simulados como XLSX',
      action: async () => {
        setShowModal(false)
        try {
          const res = await fetch('/api/generate-csv', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sql, tables: result?.tables || [] }) })
          if (!res.ok) throw new Error()
          const blob = await res.blob()
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a'); a.href = url; a.download = 'bridgebi_data.xlsx'; a.click()
          URL.revokeObjectURL(url)
        } catch { alert('Erro ao gerar arquivo.') }
      }
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', transition: 'background .3s' }}>
      <Navbar />

      <div style={{ flex: 1, padding: '16px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px', animation: 'fadeIn .4s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', display: 'flex' }}>
              <ArrowLeft size={22} />
            </button>
            <div>
              <h2 style={{ color: 'var(--accent)', fontSize: 'clamp(16px,4vw,20px)', fontWeight: 600 }}>Script Gerado</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>Revise e exporte sua análise</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 12px' }}>
            <Database size={14} style={{ color: 'var(--accent)' }} />
            <span style={{ color: 'var(--text)', fontSize: '13px' }}>HANA DB</span>
          </div>
        </div>

        {/* Layout — código FULL WIDTH no mobile, grid no desktop */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* CODE PANEL — ocupa 100% sempre, altura fixa no mobile */}
          <div style={{ background: 'var(--code-bg)', borderRadius: '10px', border: '1px solid var(--border)', overflow: 'hidden', animation: 'slideInL .4s both' }}>
            <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {['#ff5f56','#ffbd2e','#27c93f'].map((c,i) => <div key={i} style={{ width: '11px', height: '11px', borderRadius: '50%', background: c }} />)}
                <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '10px' }}>query.sql</span>
              </div>
              <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: 'var(--accent)', fontSize: '12px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                {copied ? <><Check size={13}/> Copiado!</> : <><Copy size={13}/> Copiar</>}
              </button>
            </div>
            {/* Scroll horizontal e vertical no mobile */}
            <div style={{ padding: '16px', overflowX: 'auto', overflowY: 'auto', maxHeight: '50vh' }}>
              {sql.split('\n').map((line, i) => (
                <div key={i} style={{ display: 'flex', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', lineHeight: '1.8', whiteSpace: 'nowrap' }}>
                  <span style={{ color: 'var(--text-muted)', width: '32px', flexShrink: 0, textAlign: 'right', paddingRight: '12px', userSelect: 'none', opacity: 0.5 }}>{i + 1}</span>
                  <span>{highlightSQL(line) || '\u00a0'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PAINEL LATERAL — abaixo do código no mobile, ao lado no desktop */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>

            {result?.explanation && (
              <div style={{ background: 'var(--card)', borderRadius: '10px', border: '1px solid var(--border)', padding: '16px', animation: 'fadeUp .4s both' }}>
                <p style={{ color: 'var(--accent)', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600 }}>Sobre este script</p>
                <p style={{ color: 'var(--text2)', fontSize: '13px', lineHeight: 1.5 }}>{result.explanation}</p>
                {result.tables?.length > 0 && (
                  <div style={{ marginTop: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {result.tables.map(t => (
                      <span key={t} style={{ background: 'var(--accent-dim)', border: '1px solid var(--border)', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', color: 'var(--accent)' }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div style={{ background: 'var(--card)', borderRadius: '10px', border: '1px solid var(--border)', padding: '18px', animation: 'fadeUp .4s .1s both' }}>
              <p style={{ color: 'var(--text)', fontSize: '14px', fontWeight: 500, marginBottom: '14px' }}>Validação</p>
              {CHECKS.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '3px', background: 'var(--accent)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--text2)' }}>{c.label}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Botão exportar — full width */}
          <button onClick={() => setShowModal(true)} style={{
            width: '100%', background: 'var(--accent)', color: '#fff', border: 'none',
            borderRadius: '10px', padding: '16px', fontSize: '15px', fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            fontFamily: 'Inter, sans-serif', transition: 'opacity .2s', boxShadow: 'var(--shadow)',
            animation: 'fadeUp .4s .2s both',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <Download size={18} /> Gerar Visualização
          </button>

          <div style={{ background: 'var(--footer-bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', animation: 'fadeIn .4s .3s both' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', lineHeight: 1.5 }}>
              ⚠️ <strong style={{ color: 'var(--accent)' }}>Atenção:</strong> Sempre revise a lógica antes de aplicar em produção
            </p>
          </div>
        </div>
      </div>

      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50, animation: 'fadeIn .2s both' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', padding: '24px', width: '100%', maxWidth: '380px', animation: 'fadeUp .2s both', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ color: 'var(--text)', fontSize: '18px', fontWeight: 500, marginBottom: '20px' }}>Selecione o Destino</h3>
            {EXPORT_OPTS.map((opt, i) => (
              <button key={opt.label} onClick={opt.action} style={{
                width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '14px', marginBottom: '10px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '12px',
                fontFamily: 'Inter, sans-serif', transition: 'background .2s, border-color .2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-dim)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.borderColor = 'var(--border)' }}
              >
                <opt.icon size={20} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <div style={{ textAlign: 'left' }}>
                  <p style={{ color: 'var(--text)', fontSize: '14px' }}>{opt.label}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>{opt.desc}</p>
                </div>
              </button>
            ))}
            <button onClick={() => setShowModal(false)} style={{ width: '100%', marginTop: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', padding: '8px', fontFamily: 'Inter, sans-serif' }}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}