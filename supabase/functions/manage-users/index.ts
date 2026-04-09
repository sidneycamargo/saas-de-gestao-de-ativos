import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing Authorization header')

    const userClient = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const {
      data: { user },
      error: authError,
    } = await userClient.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const adminClient = createClient(supabaseUrl, serviceRoleKey)

    const { action, payload } = await req.json()

    const { data: callerProfile } = await adminClient
      .from('profiles')
      .select('is_super_admin')
      .eq('id', user.id)
      .single()
    const isSuperAdmin = callerProfile?.is_super_admin === true

    const { data: adminMemberships } = await adminClient
      .from('company_memberships')
      .select('company_id')
      .eq('user_id', user.id)
      .eq('role', 'Admin')
    const isAdmin = adminMemberships && adminMemberships.length > 0

    if (!isSuperAdmin && !isAdmin) {
      throw new Error('Forbidden')
    }

    if (action === 'CREATE') {
      const { email, password, name, phone, company_id, role, is_super_admin, group_id } = payload

      if (!isSuperAdmin) {
        if (!company_id) throw new Error('Company is required')
        if (!adminMemberships.find((m: any) => m.company_id === company_id)) {
          throw new Error('Forbidden: Not an admin of this company')
        }
      }

      const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
        email,
        password: password || 'Mudar@123456',
        email_confirm: true,
        user_metadata: { name },
      })
      if (createError) throw createError

      const profileData: any = { name, phone: phone || null }
      if (isSuperAdmin) {
        if (is_super_admin !== undefined) profileData.is_super_admin = is_super_admin
        if (group_id !== undefined) profileData.group_id = group_id
      }

      await adminClient.from('profiles').update(profileData).eq('id', newUser.user.id)

      if (company_id) {
        await adminClient.from('company_memberships').insert({
          user_id: newUser.user.id,
          company_id,
          role: role || 'Member',
        })
      }

      return new Response(JSON.stringify({ user: newUser.user }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'UPDATE') {
      const { id, email, password, name, phone, is_super_admin, group_id } = payload

      if (!isSuperAdmin) {
        const { data: targetMemberships } = await adminClient
          .from('company_memberships')
          .select('company_id')
          .eq('user_id', id)
        const inSameCompany = targetMemberships?.some((tm: any) =>
          adminMemberships.find((am: any) => am.company_id === tm.company_id),
        )
        if (!inSameCompany) throw new Error('Forbidden: User not in your company')
      }

      const updateData: any = {}
      if (email) updateData.email = email
      if (password) updateData.password = password

      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await adminClient.auth.admin.updateUserById(id, updateData)
        if (updateError) throw updateError
      }

      const profileData: any = { name, phone: phone || null }
      if (isSuperAdmin) {
        if (is_super_admin !== undefined) profileData.is_super_admin = is_super_admin
        if (group_id !== undefined) profileData.group_id = group_id
      }

      await adminClient.from('profiles').update(profileData).eq('id', id)

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'DELETE') {
      const { id } = payload

      if (!isSuperAdmin) {
        const { data: targetMemberships } = await adminClient
          .from('company_memberships')
          .select('company_id')
          .eq('user_id', id)
        const inSameCompany = targetMemberships?.some((tm: any) =>
          adminMemberships.find((am: any) => am.company_id === tm.company_id),
        )
        if (!inSameCompany) throw new Error('Forbidden: User not in your company')
      }

      const { error: deleteError } = await adminClient.auth.admin.deleteUser(id)
      if (deleteError) throw deleteError

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    throw new Error('Invalid action')
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
