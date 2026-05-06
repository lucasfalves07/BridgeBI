import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, Package, Database, Users, Plus, Trash2, ChevronRight, Clock, X } from 'lucide-react'
import Navbar from '../components/Navbar'

const quickLinks = [
  { icon: ShoppingCart, label: 'Compras',  table: 'EKPO', question: 'Mostrar todas as ordens de compra do último mês' },
  { icon: Package,      label: 'Vendas',   table: 'VBAP', question: 'Listar as vendas por material e cliente' },
  { icon: Database,     label: 'Produção', table: 'AFPO', question: 'Ver ordens de produção abertas por centro' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [query, setQuery]           = useState('')
  const user = JSON.parse(sessionStorage.getItem('bridgebi_user') || '{}')
  const isAdmin = user.role === 'admin'

  // Admin state
  const [users, setUsers]           = useState([])
  const [selectedUser, setSelected] = useState(null)
  const [history, setHistory]       = useState([])
  const [showModal, setShowModal]   = useState(false)
  const [form, setForm]             = useState({ name: '', email: '', password: '', role: 'funcionario' })
  const [formError, setFormError]   = useState('')
  const [loadingForm, setLoadingForm] = useState(false)

  useEffect(() => {
    if (isAdmin) fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const res = await fetch('/api/users')
    setUsers(await res.json())
  }

  const fetchHistory = async (email) => {
    setSelected(email)
    const res = await fetch(`/api/history/${encodeURIComponent(email)}`)
    setHistory(await res.json())
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setFormError('')
    setLoadingForm(true)
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setShowModal(false)
      setForm({ name: '', email: '', password: '', role: 'funcionario' })
      fetchUsers()
    } else {
      const data = await res.json()
      setFormError(data.detail || 'Erro ao criar usuário')
    }
    setLoadingForm(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Deseja remover este usuário?')) return
    await fetch(`/api/users/${id}`, { method: 'DELETE' })
    fetchUsers()
    setSelected(null)
    setHistory([])
  }

  const handleSearch = (q) => {
    const question = q || query
    if (!question.trim()) return
    sessionStorage.setItem('bridgebi_question', question)
    navigate('/thinking')
  }

  const roleLabel = (role) => role === 'admin' ? '👑 Admin' : '👤 Funcionário'
  const roleColor = (role) => role === 'admin' ? '#FFD700' : 'rgba(255,255,255,0.6)'

  return (
    <div style={{ minHeight: '100vh', background: '#121212', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px 100px' }}>
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
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(255,215,0,0.15), rgba(255,215,0,0.05))', borderRadius: '8px', filter: 'blur(4px)' }} />
            <div style={{ position: 'relative', background: '#2C2C2C', borderRadius: '8px', border: '1px solid rgba(255,215,0,0.3)', display: 'flex', alignItems: 'center', transition: 'border-color .2s' }}
              onFocusCapture={e => e.currentTarget.style.borderColor = '#FFD700'}
              onBlurCapture={e => e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)'}
            >
              <Search size={18} style={{ position: 'absolute', left: '20px', color: '#FFD700', pointerEvents: 'none' }} />
              <input
                type="text" value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Qual insight você precisa extrair hoje?"
                style={{ width: '100%', background: 'transparent', color: '#fff', border: 'none', padding: '20px 20px 20px 52px', fontSize: '15px', fontFamily: 'Inter, sans-serif', outline: 'none' }}
              />
            </div>
          </div>

          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
            {quickLinks.map((link, i) => (
              <button key={link.label} onClick={() => handleSearch(link.question)} style={{
                background: '#2C2C2C', border: '1px solid rgba(255,215,0,0.2)',
                borderRadius: '8px', padding: '24px', cursor: 'pointer',
                textAlign: 'center', transition: 'background .2s, border-color .2s',
                animation: `fadeUp .4s ${0.3 + i * 0.1}s both`, fontFamily: 'Inter, sans-serif',
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

        {/* ── PAINEL ADMIN ── */}
        {isAdmin && (
          <div style={{ width: '100%', maxWidth: '1000px', marginTop: '60px', animation: 'fadeUp .4s .5s both' }}>

            {/* Divisor */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,215,0,0.15)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFD700', fontSize: '13px' }}>
                <Users size={15} /> Painel Administrativo
              </div>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,215,0,0.15)' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button onClick={() => setShowModal(true)} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: '#FFD700', color: '#121212', border: 'none',
                borderRadius: '8px', padding: '10px 18px', fontSize: '13px',
                fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}>
                <Plus size={15} /> Novo Funcionário
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '16px' }}>

              {/* Lista usuários */}
              <div style={{ background: '#1E1E1E', borderRadius: '8px', border: '1px solid rgba(255,215,0,0.15)', overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={14} style={{ color: '#FFD700' }} />
                  <span style={{ color: '#fff', fontSize: '13px' }}>Usuários ({users.length})</span>
                </div>
                {users.map(u => (
                  <div key={u.id} onClick={() => fetchHistory(u.email)} style={{
                    padding: '12px 16px', cursor: 'pointer',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: selectedUser === u.email ? 'rgba(255,215,0,0.06)' : 'transparent',
                    borderLeft: selectedUser === u.email ? '3px solid #FFD700' : '3px solid transparent',
                    transition: 'background .2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                    onMouseEnter={e => { if (selectedUser !== u.email) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                    onMouseLeave={e => { if (selectedUser !== u.email) e.currentTarget.style.background = 'transparent' }}
                  >
                    <div>
                      <p style={{ color: '#fff', fontSize: '13px', marginBottom: '2px' }}>{u.name}</p>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>{u.email}</p>
                      <p style={{ color: roleColor(u.role), fontSize: '11px', marginTop: '2px' }}>{roleLabel(u.role)}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button onClick={e => { e.stopPropagation(); handleDelete(u.id) }}
                        style={{ background: 'none', border: 'none', color: 'rgba(255,80,80,0.4)', cursor: 'pointer', padding: '4px', transition: 'color .2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ff5050'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,80,80,0.4)'}
                      >
                        <Trash2 size={13} />
                      </button>
                      <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.2)' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Histórico do usuário */}
              <div style={{ background: '#1E1E1E', borderRadius: '8px', border: '1px solid rgba(255,215,0,0.15)', overflow: 'hidden' }}>
                {!selectedUser ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '250px', color: 'rgba(255,255,255,0.25)' }}>
                    <Clock size={36} style={{ marginBottom: '10px', opacity: .4 }} />
                    <p style={{ fontSize: '13px' }}>Selecione um usuário para ver o histórico</p>
                  </div>
                ) : (
                  <>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={14} style={{ color: '#FFD700' }} />
                        <span style={{ color: '#fff', fontSize: '13px' }}>Histórico de {selectedUser}</span>
                      </div>
                      <button onClick={() => { setSelected(null); setHistory([]) }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                        <X size={15} />
                      </button>
                    </div>
                    {history.length === 0 ? (
                      <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>Nenhuma consulta encontrada</div>
                    ) : (
                      <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
                        {history.map((h, i) => (
                          <div key={h.id} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', animation: `fadeUp .3s ${i * 0.04}s both` }}>
                            <p style={{ color: '#fff', fontSize: '13px', marginBottom: '6px', lineHeight: 1.4 }}>{h.question}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                              <span style={{ color: '#4ade80', fontSize: '11px' }}>✓ {h.status}</span>
                              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>{new Date(h.created_at).toLocaleString('pt-BR')}</span>
                              {h.tables && h.tables.split(', ').filter(Boolean).map(t => (
                                <span key={t} style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '4px', padding: '1px 6px', fontSize: '10px', color: 'rgba(255,215,0,0.7)' }}>{t}</span>
                              ))}
                            </div>
                            <div style={{ marginTop: '8px', background: '#0a0a0a', borderRadius: '6px', padding: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.4)', overflowX: 'auto', whiteSpace: 'pre' }}>
                              {h.sql?.slice(0, 200)}{h.sql?.length > 200 ? '...' : ''}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer style={{ padding: '12px 24px', background: 'rgba(255,215,0,0.08)', borderTop: '1px solid rgba(255,215,0,0.25)' }}>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
          ⚠️ Sempre revise a lógica antes de aplicar em produção
        </p>
      </footer>

      {/* Modal novo usuário */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 50, animation: 'fadeIn .2s both' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#1E1E1E', borderRadius: '12px', border: '1px solid rgba(255,215,0,0.3)', padding: '28px', width: '100%', maxWidth: '400px', animation: 'fadeUp .2s both' }}>
            <h3 style={{ color: '#FFD700', fontSize: '16px', fontWeight: 500, marginBottom: '20px' }}>Novo Usuário</h3>
            <form onSubmit={handleCreate}>
              {[
                { label: 'Nome', key: 'name', type: 'text', placeholder: 'Nome completo' },
                { label: 'E-mail', key: 'email', type: 'email', placeholder: 'email@empresa.com' },
                { label: 'Senha', key: 'password', type: 'password', placeholder: 'Senha de acesso' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: '14px' }}>
                  <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} required
                    style={{ width: '100%', background: '#2C2C2C', color: '#fff', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '8px', padding: '11px 14px', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#FFD700'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,215,0,0.2)'}
                  />
                </div>
              ))}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Perfil</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                  style={{ width: '100%', background: '#2C2C2C', color: '#fff', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '8px', padding: '11px 14px', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none' }}>
                  <option value="funcionario">👤 Funcionário</option>
                  <option value="admin">👑 Administrador</option>
                </select>
              </div>
              {formError && <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: '8px', padding: '10px', marginBottom: '14px', color: '#ff8080', fontSize: '13px' }}>{formError}</div>}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px', color: 'rgba(255,255,255,0.5)', fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Cancelar</button>
                <button type="submit" disabled={loadingForm} style={{ flex: 1, background: '#FFD700', color: '#121212', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', opacity: loadingForm ? 0.7 : 1 }}>
                  {loadingForm ? 'Criando...' : 'Criar Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}