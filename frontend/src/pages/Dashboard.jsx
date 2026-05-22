import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, Package, Database, Users, Plus, Trash2, ChevronRight, Clock, X } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useTheme } from '../hooks/useTheme'

const quickLinks = [
  { icon: ShoppingCart, label: 'Compras',  table: 'EKPO', question: 'Mostrar todas as ordens de compra do último mês' },
  { icon: Package,      label: 'Vendas',   table: 'VBAP', question: 'Listar as vendas por material e cliente' },
  { icon: Database,     label: 'Produção', table: 'AFPO', question: 'Ver ordens de produção abertas por centro' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [query, setQuery] = useState('')
  const user    = JSON.parse(sessionStorage.getItem('bridgebi_user') || '{}')
  const isAdmin = user.role === 'admin'

  const [users, setUsers]             = useState([])
  const [selectedUser, setSelected]   = useState(null)
  const [history, setHistory]         = useState([])
  const [showModal, setShowModal]     = useState(false)
  const [form, setForm]               = useState({ name: '', email: '', password: '', role: 'funcionario' })
  const [formError, setFormError]     = useState('')
  const [loadingForm, setLoadingForm] = useState(false)

  useEffect(() => { if (isAdmin) fetchUsers() }, [])

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
    fetchUsers(); setSelected(null); setHistory([])
  }

  const handleSearch = (q) => {
    const question = q || query
    if (!question.trim()) return
    sessionStorage.setItem('bridgebi_question', question)
    navigate('/thinking')
  }

  const inputStyle = {
    width: '100%', background: 'var(--input-bg)', color: 'var(--text)',
    border: '1px solid var(--border)', borderRadius: '8px',
    padding: '11px 14px', fontSize: '14px',
    fontFamily: 'Inter, sans-serif', outline: 'none', transition: 'border-color .2s',
  }

  const isMobile = window.innerWidth <= 768

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', transition: 'background .3s' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 16px 100px' }}>
        <div style={{ width: '100%', maxWidth: '700px', animation: 'fadeUp .4s .2s both' }}>

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ color: 'var(--text)', fontSize: 'clamp(20px,5vw,32px)', fontWeight: 600, marginBottom: '8px' }}>
              A Ponte Entre Dados e Insights
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Transforme perguntas em análises com IA
            </p>
          </div>

          <div style={{ position: 'relative', marginBottom: '32px' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--accent-glow)', borderRadius: '10px', filter: 'blur(8px)' }} />
            <div style={{ position: 'relative', background: 'var(--card)', borderRadius: '10px', border: '1.5px solid var(--accent)', display: 'flex', alignItems: 'center', boxShadow: 'var(--shadow)' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', color: 'var(--accent)', pointerEvents: 'none' }} />
              <input
                type="text" value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Qual insight você precisa extrair hoje?"
                style={{ width: '100%', background: 'transparent', color: 'var(--text)', border: 'none', padding: '18px 16px 18px 48px', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none' }}
              />
            </div>
          </div>

          {/* Cards — 3 colunas desktop, 1 mobile */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }} className="grid-3">
            {quickLinks.map((link, i) => (
              <button key={link.label} onClick={() => handleSearch(link.question)} style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: '10px', padding: '20px 16px', cursor: 'pointer',
                textAlign: 'center', transition: 'all .2s',
                animation: `fadeUp .4s ${0.3 + i * 0.1}s both`,
                fontFamily: 'Inter, sans-serif', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-dim)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--card)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <link.icon size={28} style={{ color: 'var(--accent)', margin: '0 auto 10px', display: 'block' }} />
                <p style={{ color: 'var(--text)', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>{link.label}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{link.table}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Painel Admin */}
        {isAdmin && (
          <div style={{ width: '100%', maxWidth: '1000px', marginTop: '48px', animation: 'fadeUp .4s .5s both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontSize: '13px', fontWeight: 500 }}>
                <Users size={15} /> Painel Administrativo
              </div>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
              <button onClick={() => setShowModal(true)} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'var(--accent)', color: '#fff', border: 'none',
                borderRadius: '8px', padding: '10px 16px', fontSize: '13px',
                fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'opacity .2s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <Plus size={15} /> Novo Funcionário
              </button>
            </div>

            {/* Grid admin — empilha no mobile */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>

              {/* Lista usuários */}
              <div style={{ background: 'var(--card)', borderRadius: '10px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={14} style={{ color: 'var(--accent)' }} />
                  <span style={{ color: 'var(--text)', fontSize: '13px', fontWeight: 500 }}>Usuários ({users.length})</span>
                </div>
                {users.map(u => (
                  <div key={u.id} onClick={() => fetchHistory(u.email)} style={{
                    padding: '12px 16px', cursor: 'pointer',
                    borderBottom: '1px solid var(--border2)',
                    background: selectedUser === u.email ? 'var(--accent-dim)' : 'transparent',
                    borderLeft: selectedUser === u.email ? '3px solid var(--accent)' : '3px solid transparent',
                    transition: 'background .2s', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                    onMouseEnter={e => { if (selectedUser !== u.email) e.currentTarget.style.background = 'var(--bg3)' }}
                    onMouseLeave={e => { if (selectedUser !== u.email) e.currentTarget.style.background = 'transparent' }}
                  >
                    <div>
                      <p style={{ color: 'var(--text)', fontSize: '13px', marginBottom: '2px', fontWeight: 500 }}>{u.name}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{u.email}</p>
                      <p style={{ color: u.role === 'admin' ? 'var(--accent)' : 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>
                        {u.role === 'admin' ? '👑 Admin' : '👤 Funcionário'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button onClick={e => { e.stopPropagation(); handleDelete(u.id) }}
                        style={{ background: 'none', border: 'none', color: 'rgba(239,68,68,0.4)', cursor: 'pointer', padding: '4px', transition: 'color .2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(239,68,68,0.4)'}
                      >
                        <Trash2 size={13} />
                      </button>
                      <ChevronRight size={13} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Histórico do usuário selecionado */}
              <div style={{ background: 'var(--card)', borderRadius: '10px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                {!selectedUser ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', color: 'var(--text-muted)' }}>
                    <Clock size={32} style={{ marginBottom: '10px', opacity: .4 }} />
                    <p style={{ fontSize: '13px' }}>Selecione um usuário para ver o histórico</p>
                  </div>
                ) : (
                  <>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                        <Clock size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                        <span style={{ color: 'var(--text)', fontSize: '13px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          Histórico de {selectedUser}
                        </span>
                      </div>
                      <button onClick={() => { setSelected(null); setHistory([]) }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0 }}>
                        <X size={15} />
                      </button>
                    </div>
                    {history.length === 0 ? (
                      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>Nenhuma consulta encontrada</div>
                    ) : (
                      <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
                        {history.map((h, i) => (
                          <div key={h.id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border2)', animation: `fadeUp .3s ${i * 0.04}s both` }}>
                            <p style={{ color: 'var(--text)', fontSize: '13px', marginBottom: '6px', lineHeight: 1.4 }}>{h.question}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                              <span style={{ color: '#10B981', fontSize: '11px' }}>✓ {h.status}</span>
                              <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{new Date(h.created_at).toLocaleString('pt-BR')}</span>
                              {h.tables && h.tables.split(', ').filter(Boolean).map(t => (
                                <span key={t} style={{ background: 'var(--accent-dim)', border: '1px solid var(--border)', borderRadius: '4px', padding: '1px 6px', fontSize: '10px', color: 'var(--accent)' }}>{t}</span>
                              ))}
                            </div>
                            {/* Script com scroll horizontal */}
                            <div style={{ background: 'var(--code-bg)', borderRadius: '6px', padding: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--text-muted)', overflowX: 'auto', whiteSpace: 'pre', border: '1px solid var(--border2)', maxHeight: '120px', overflowY: 'auto' }}>
                              {h.sql?.slice(0, 300)}{h.sql?.length > 300 ? '...' : ''}
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

      <footer style={{ padding: '12px 24px', background: 'var(--footer-bg)', borderTop: '1px solid var(--border)' }}>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
          ⚠️ Sempre revise a lógica antes de aplicar em produção
        </p>
      </footer>

      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50, animation: 'fadeIn .2s both' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', padding: '24px', width: '100%', maxWidth: '400px', animation: 'fadeUp .2s both', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ color: 'var(--accent)', fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Novo Usuário</h3>
            <form onSubmit={handleCreate}>
              {[
                { label: 'Nome', key: 'name', type: 'text', placeholder: 'Nome completo' },
                { label: 'E-mail', key: 'email', type: 'email', placeholder: 'email@empresa.com' },
                { label: 'Senha', key: 'password', type: 'password', placeholder: 'Senha de acesso' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: '14px' }}>
                  <label style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })} required style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
              ))}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Perfil</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={inputStyle}>
                  <option value="funcionario">👤 Funcionário</option>
                  <option value="admin">👑 Administrador</option>
                </select>
              </div>
              {formError && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px', marginBottom: '14px', color: '#ef4444', fontSize: '13px' }}>{formError}</div>}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, background: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Cancelar</button>
                <button type="submit" disabled={loadingForm} style={{ flex: 1, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', opacity: loadingForm ? 0.7 : 1 }}>
                  {loadingForm ? 'Criando...' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}