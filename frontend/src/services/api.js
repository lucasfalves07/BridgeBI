const BASE_URL = '/api'

export async function generateSQL(question) {
  const res = await fetch(`${BASE_URL}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Erro ao gerar script')
  }
  return res.json()
}

export async function getHistory() {
  const res = await fetch(`${BASE_URL}/history`)
  if (!res.ok) throw new Error('Erro ao buscar histórico')
  return res.json()
}

export async function getTables() {
  const res = await fetch(`${BASE_URL}/tables`)
  if (!res.ok) throw new Error('Erro ao buscar tabelas')
  return res.json()
}
