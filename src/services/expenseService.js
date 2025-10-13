import { supabase } from '@/lib/supabase'

export async function listExpenses() {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map(mapExpense)
}

export async function createExpense(payload) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('not-auth')

  const { data, error } = await supabase
    .from('expenses')
    .insert({
      user_id: user.id,
      tipo: payload.tipo,
      tipo_transacao: payload.tipoTransacao,
      parcelas: payload.parcelas ?? null,
      data: payload.data,
      valor: payload.valor,
      categoria: payload.categoria,
      descricao: payload.descricao || null,
      credit_card_id: payload.creditCardId || null,
    })
    .select('*')
    .single()

  if (error) throw error
  return mapExpense(data)
}

export async function updateExpense(id, payload) {
  const { data, error } = await supabase
    .from('expenses')
    .update({
      tipo: payload.tipo,
      tipo_transacao: payload.tipoTransacao,
      parcelas: payload.parcelas ?? null,
      data: payload.data,
      valor: payload.valor,
      categoria: payload.categoria,
      descricao: payload.descricao || null,
      credit_card_id: payload.creditCardId || null,
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return mapExpense(data)
}

export async function removeExpense(id) {
  const { error } = await supabase.from('expenses').delete().eq('id', id)
  if (error) throw error
}

function mapExpense(row) {
  return {
    id: row.id,
    tipo: row.tipo,
    tipoTransacao: row.tipo_transacao,
    parcelas: row.parcelas,
    data: row.data,
    valor: Number(row.valor),
    categoria: row.categoria,
    descricao: row.descricao || '',
    creditCardId: row.credit_card_id,
    created_at: row.created_at,
  }
}
