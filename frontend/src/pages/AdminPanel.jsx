import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Plus, Trash2, Clock, ChevronRight, ArrowLeft, X } from 'lucide-react'
import Navbar from '../components/Navbar'

export default function AdminPanel() {
  const navigate  = useNavigate()
  const [users, setUsers]           = useState([])
  const [selectedUser, setSelected] = useState(null)
  const [history, setHistory]       = useState([])
  const [showModal, setShowModal]   = useState(false)
  const [loading, setLoading]       = useState(false)
  const [form, setForm]             = useState({ name: '', email: '', password: '', role: 'funcionario' })
  const [error, setError]           = useState('')

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('bridgebi_user') || '{}')
    if (user.role !== 'admin') navigate('/dashboard')
    fetchUsers()
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
    setError('')
    setLoading(true)
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
      setError(data.detail || 'Erro ao criar usuário')
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Deseja remover este usuário?')) return
    await fetch(`/api/users/${id}`, { method: 'DELETE' })
    fetchUsers()
    if (selectedUser) setSelected(null)
    setHistory([])
  }

  const roleLabel = (role) => role === 'admin' ? '👑 Admin' : '👤 Funcionário'
  const roleColor = (role) => role === 'admin' ? '#FFD700' : 'rgba(255,255,255,0.6)'

  return (
    <div style={{ minHeight: '100vh', background: '#121212', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ flex: 1, padding: '24px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', animation: 'fadeIn .4s both' }}>
          <div>
            <h2 style={{ color: '#FFD700', fontSize: '20px', fontWeight: 400 }}>Painel Administrativo</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '2px' }}>Gerencie usuários e histórico de consultas</p>
          </div>
          <button onClick={() => setShowModal(true)} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#FFD700', color: '#121212', border: 'none',
            borderRadius: '8px', padding: '10px 18px', fontSize: '13px',
            fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}>
            <Plus size={16} /> Novo Funcionário
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '16px' }}>

          {/* Lista de usuários */}
          <div style={{ background: '#1E1E1E', borderRadius: '8px', border: '1px solid rgba(255,215,0,0.15)', overflow: 'hidden', animation: 'slideInL .4s both' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={15} style={{ color: '#FFD700' }} />
              <span style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>Usuários ({users.length})</span>
            </div>
            {users.map(u => (
              <div key={u.id}
                onClick={() => fetchHistory(u.email)}
                style={{
                  padding: '14px 16px', cursor: 'pointer',
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
                  <p style={{ color: '#fff', fontSize: '13px', marginBottom: '3px' }}>{u.name}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>{u.email}</p>
                  <p style={{ color: roleColor(u.role), fontSize: '11px', marginTop: '3px' }}>{roleLabel(u.role)}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={e => { e.stopPropagation(); handleDelete(u.id) }}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,80,80,0.5)', cursor: 'pointer', padding: '4px', transition: 'color .2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ff5050'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,80,80,0.5)'}
                  >
                    <Trash2 size={14} />
                  </button>
                  <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.2)' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Histórico do usuário selecionado */}
          <div style={{ background: '#1E1E1E', borderRadius: '8px', border: '1px solid rgba(255,215,0,0.15)', overflow: 'hidden', animation: 'slideInR .4s both' }}>
            {!selectedUser ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'rgba(255,255,255,0.25)' }}>
                <Clock size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
                <p style={{ fontSize: '14px' }}>Selecione um usuário para ver o histórico</p>
              </div>
            ) : (
              <>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={15} style={{ color: '#FFD700' }} />
                    <span style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>
                      Histórico de {selectedUser}
                    </span>
                  </div>
                  <button onClick={() => { setSelected(null); setHistory([]) }}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                    <X size={16} />
                  </button>
                </div>

                {history.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
                    Nenhuma consulta encontrada para este usuário
                  </div>
                ) : (
                  <div style={{ overflowY: 'auto', maxHeight: '500px' }}>
                    {history.map((h, i) => (
                      <div key={h.id} style={{
                        padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)',
                        animation: `fadeUp .3s ${i * 0.04}s both`,
                      }}>
                        <p style={{ color: '#fff', fontSize: '13px', marginBottom: '6px', lineHeight: 1.4 }}>{h.question}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                          <span style={{ color: '#4ade80', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            ✓ {h.status}
                          </span>
                          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>
                            {new Date(h.created_at).toLocaleString('pt-BR')}
                          </span>
                          {h.tables && h.tables.split(', ').filter(Boolean).map(t => (
                            <span key={t} style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '4px', padding: '1px 7px', fontSize: '10px', color: 'rgba(255,215,0,0.7)' }}>
                              {t}
                            </span>
                          ))}
                        </div>
                        <div style={{ marginTop: '8px', background: '#0a0a0a', borderRadius: '6px', padding: '10px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.5)', overflowX: 'auto', whiteSpace: 'pre' }}>
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

      {/* Modal novo funcionário */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px', zIndex: 50, animation: 'fadeIn .2s both',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#1E1E1E', borderRadius: '12px',
            border: '1px solid rgba(255,215,0,0.3)',
            padding: '28px', width: '100%', maxWidth: '400px',
            animation: 'fadeUp .2s both',
          }}>
            <h3 style={{ color: '#FFD700', fontSize: '16px', fontWeight: 500, marginBottom: '20px' }}>Novo Usuário</h3>

            <form onSubmit={handleCreate}>
              {[
                { label: 'Nome', key: 'name', type: 'text', placeholder: 'Nome completo' },
                { label: 'E-mail', key: 'email', type: 'email', placeholder: 'email@empresa.com' },
                { label: 'Senha', key: 'password', type: 'password', placeholder: 'Senha de acesso' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: '14px' }}>
                  <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    required
                    style={{
                      width: '100%', background: '#2C2C2C', color: '#fff',
                      border: '1px solid rgba(255,215,0,0.2)', borderRadius: '8px',
                      padding: '11px 14px', fontSize: '14px',
                      fontFamily: 'Inter, sans-serif', outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = '#FFD700'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,215,0,0.2)'}
                  />
                </div>
              ))}

              <div style={{ marginBottom: '18px' }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Perfil</label>
                <select
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  style={{
                    width: '100%', background: '#2C2C2C', color: '#fff',
                    border: '1px solid rgba(255,215,0,0.2)', borderRadius: '8px',
                    padding: '11px 14px', fontSize: '14px',
                    fontFamily: 'Inter, sans-serif', outline: 'none',
                  }}
                >
                  <option value="funcionario">👤 Funcionário</option>
                  <option value="admin">👑 Administrador</option>
                </select>
              </div>

              {error && (
                <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: '8px', padding: '10px', marginBottom: '14px', color: '#ff8080', fontSize: '13px' }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{
                  flex: 1, background: 'none', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px', padding: '12px', color: 'rgba(255,255,255,0.5)',
                  fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                }}>
                  Cancelar
                </button>
                <button type="submit" disabled={loading} style={{
                  flex: 1, background: '#FFD700', color: '#121212', border: 'none',
                  borderRadius: '8px', padding: '12px', fontSize: '13px',
                  fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  opacity: loading ? 0.7 : 1,
                }}>
                  {loading ? 'Criando...' : 'Criar Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
