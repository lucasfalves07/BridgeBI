import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, Package, Database } from 'lucide-react'
import Navbar from '../components/Navbar'

const quickLinks = [
  { icon: ShoppingCart, label: 'Compras',  table: 'EKPO', question: 'Mostrar todas as ordens de compra do último mês' },
  { icon: Package,      label: 'Vendas',   table: 'VBAP', question: 'Listar as vendas por material e cliente' },
  { icon: Database,     label: 'Produção', table: 'AFPO', question: 'Ver ordens de produção abertas por centro' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const handleSearch = (q) => {
    const question = q || query
    if (!question.trim()) return
    sessionStorage.setItem('bridgebi_question', question)
    navigate('/thinking')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#121212', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '700px', animation: 'fadeUp .4s .2s both' }}>

          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ color: 'rgba(255,255,255,0.9)', fontSize: '32px', fontWeight: 400, marginBottom: '8px' }}>
              A Ponte Entre Dados e Insights
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
              Transforme perguntas em análises com IA
            </p>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '40px' }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to right, rgba(255,215,0,0.15), rgba(255,215,0,0.05))',
              borderRadius: '8px', filter: 'blur(4px)',
            }} />
            <div style={{
              position: 'relative', background: '#2C2C2C', borderRadius: '8px',
              border: '1px solid rgba(255,215,0,0.3)',
              display: 'flex', alignItems: 'center',
              transition: 'border-color .2s',
            }}
              onFocusCapture={e => e.currentTarget.style.borderColor = '#FFD700'}
              onBlurCapture={e => e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)'}
            >
              <Search size={18} style={{ position: 'absolute', left: '20px', color: '#FFD700', pointerEvents: 'none' }} />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Qual insight você precisa extrair hoje?"
                style={{
                  width: '100%', background: 'transparent', color: '#fff',
                  border: 'none', padding: '20px 20px 20px 52px',
                  fontSize: '15px', fontFamily: 'Inter, sans-serif', outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
            {quickLinks.map((link, i) => (
              <button
                key={link.label}
                onClick={() => handleSearch(link.question)}
                style={{
                  background: '#2C2C2C', border: '1px solid rgba(255,215,0,0.2)',
                  borderRadius: '8px', padding: '24px', cursor: 'pointer',
                  textAlign: 'center', transition: 'background .2s, border-color .2s',
                  animation: `fadeUp .4s ${0.3 + i * 0.1}s both`,
                  fontFamily: 'Inter, sans-serif',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#3C3C3C'; e.currentTarget.style.borderColor = 'rgba(255,215,0,0.5)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#2C2C2C'; e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)' }}
              >
                <link.icon size={32} style={{ color: '#FFD700', margin: '0 auto 12px', display: 'block' }} />
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '4px' }}>{link.label}</p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>{link.table}</p>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '12px 24px',
        background: 'rgba(255,215,0,0.08)',
        borderTop: '1px solid rgba(255,215,0,0.25)',
        animation: 'fadeIn .4s .5s both',
      }}>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
          ⚠️ Sempre revise a lógica antes de aplicar em produção
        </p>
      </footer>
    </div>
  )
}
