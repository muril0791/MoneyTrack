import { supabase } from '@/lib/supabase'

export async function listCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createCategory({ name, type }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('not-auth')

  const { data, error } = await supabase
    .from('categories')
    .insert({ user_id: user.id, name, type })
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function updateCategory(id, { name, type }) {
  const { data, error } = await supabase
    .from('categories')
    .update({ name, type })
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function removeCategory(id) {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}
