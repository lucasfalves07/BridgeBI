import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Plus, Trash2, Clock, ChevronRight, X } from 'lucide-react'
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
    setSelected(null)
    setHistory([])
  }

  const inputStyle = {
    width: '100%', background: 'var(--input-bg)', color: 'var(--text)',
    border: '1px solid var(--border)', borderRadius: '8px',
    padding: '11px 14px', fontSize: '14px',
    fontFamily: 'Inter, sans-serif', outline: 'none', transition: 'border-color .2s',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', transition: 'background .3s' }}>
      <Navbar />
      <div style={{ flex: 1, padding: '16px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', animation: 'fadeIn .4s both', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ color: 'var(--accent)', fontSize: 'clamp(16px,4vw,20px)', fontWeight: 600 }}>Painel Administrativo</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>Gerencie usuários e histórico de consultas</p>
          </div>
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

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '16px' }} className="grid-2">

          <div style={{ background: 'var(--card)', borderRadius: '10px', border: '1px solid var(--border)', overflow: 'hidden', animation: 'slideInL .4s both' }}>
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

          <div style={{ background: 'var(--card)', borderRadius: '10px', border: '1px solid var(--border)', overflow: 'hidden', animation: 'slideInR .4s both' }}>
            {!selectedUser ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '250px', color: 'var(--text-muted)' }}>
                <Clock size={36} style={{ marginBottom: '10px', opacity: 0.4 }} />
                <p style={{ fontSize: '13px' }}>Selecione um usuário para ver o histórico</p>
              </div>
            ) : (
              <>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={14} style={{ color: 'var(--accent)' }} />
                    <span style={{ color: 'var(--text)', fontSize: '13px', fontWeight: 500 }}>Histórico de {selectedUser}</span>
                  </div>
                  <button onClick={() => { setSelected(null); setHistory([]) }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={15} />
                  </button>
                </div>
                {history.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>Nenhuma consulta encontrada</div>
                ) : (
                  <div style={{ overflowY: 'auto', maxHeight: '500px' }}>
                    {history.map((h, i) => (
                      <div key={h.id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border2)', animation: `fadeUp .3s ${i * 0.04}s both` }}>
                        <p style={{ color: 'var(--text)', fontSize: '13px', marginBottom: '6px', lineHeight: 1.4 }}>{h.question}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <span style={{ color: '#10B981', fontSize: '11px' }}>✓ {h.status}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{new Date(h.created_at).toLocaleString('pt-BR')}</span>
                          {h.tables && h.tables.split(', ').filter(Boolean).map(t => (
                            <span key={t} style={{ background: 'var(--accent-dim)', border: '1px solid var(--border)', borderRadius: '4px', padding: '1px 6px', fontSize: '10px', color: 'var(--accent)' }}>{t}</span>
                          ))}
                        </div>
                        <div style={{ marginTop: '8px', background: 'var(--code-bg)', borderRadius: '6px', padding: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--text-muted)', overflowX: 'auto', whiteSpace: 'pre', border: '1px solid var(--border2)' }}>
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
              {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px', marginBottom: '14px', color: '#ef4444', fontSize: '13px' }}>{error}</div>}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, background: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Cancelar</button>
                <button type="submit" disabled={loading} style={{ flex: 1, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', opacity: loading ? 0.7 : 1 }}>
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