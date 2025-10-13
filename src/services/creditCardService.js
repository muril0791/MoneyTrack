import { supabase } from '@/lib/supabase'

export async function listCreditCards() {
  const { data, error } = await supabase.from('credit_cards').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data.map(mapCard)
}

export async function createCreditCard({ name, limit, closingDay, dueDay }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('not-auth')

  const { data, error } = await supabase
    .from('credit_cards')
    .insert({
      user_id: user.id,
      name,
      limit,
      closing_day: closingDay,
      due_day: dueDay,
    })
    .select('*')
    .single()

  if (error) throw error
  return mapCard(data)
}

export async function updateCreditCard(id, { name, limit, closingDay, dueDay }) {
  const { data, error } = await supabase
    .from('credit_cards')
    .update({ name, limit, closing_day: closingDay, due_day: dueDay })
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return mapCard(data)
}

export async function removeCreditCard(id) {
  const { error } = await supabase.from('credit_cards').delete().eq('id', id)
  if (error) throw error
}

function mapCard(row) {
  return {
    id: row.id,
    name: row.name,
    limit: Number(row.limit),
    closingDay: row.closing_day,
    dueDay: row.due_day,
    created_at: row.created_at,
  }
}
