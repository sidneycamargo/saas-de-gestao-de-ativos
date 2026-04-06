import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type BrandInsert = Database['public']['Tables']['brands']['Insert']
type BrandUpdate = Database['public']['Tables']['brands']['Update']

export const getBrands = async (companyId: string, search?: string) => {
  let query = supabase.from('brands').select('*').eq('company_id', companyId).order('name')

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export const createBrand = async (brand: BrandInsert) => {
  const { data, error } = await supabase.from('brands').insert(brand).select().single()

  if (error) throw error
  return data
}

export const updateBrand = async (id: string, brand: BrandUpdate) => {
  const { data, error } = await supabase.from('brands').update(brand).eq('id', id).select().single()

  if (error) throw error
  return data
}

export const deleteBrand = async (id: string) => {
  const { error } = await supabase.from('brands').delete().eq('id', id)

  if (error) throw error
}
