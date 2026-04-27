import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing authorization')

    // Client admin per tutte le operazioni
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SERVICE_ROLE_KEY')!
    )

    // Verifica utente tramite token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
    if (userError || !user) throw new Error('Unauthorized')

    // Verifica ruolo admin
    const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single()
    if (!profile || profile.role !== 'admin') throw new Error('Forbidden: admin only')

    const { action, userId, email, password, fullName, role, asl } = await req.json()

    let result

    if (action === 'list') {
      const { data: users } = await supabaseAdmin.auth.admin.listUsers()
      const { data: profiles } = await supabaseAdmin.from('profiles').select('*')
      result = users.users.map(u => ({
        id: u.id,
        email: u.email,
        banned: u.banned_until ? new Date(u.banned_until) > new Date() : false,
        profile: profiles?.find(p => p.id === u.id) || null
      }))
    }

    else if (action === 'create') {
      const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
        email, password, email_confirm: true
      })
      if (error) throw error
      await supabaseAdmin.from('profiles').insert({
  id: newUser.user.id,
  full_name: fullName,
  role: role || 'verificatore',
  asl: asl || 'ASL Benevento'
})
      result = { id: newUser.user.id }
    }

    else if (action === 'update_role') {
      await supabaseAdmin.from('profiles').update({ role }).eq('id', userId)
      result = { ok: true }
    }

    else if (action === 'ban') {
      await supabaseAdmin.auth.admin.updateUserById(userId, { ban_duration: '876600h' })
      result = { ok: true }
    }

    else if (action === 'unban') {
      await supabaseAdmin.auth.admin.updateUserById(userId, { ban_duration: 'none' })
      result = { ok: true }
    }

    else if (action === 'update_profile') {
      const updates: Record<string, unknown> = {}
      if (fullName !== undefined && fullName !== null) updates.full_name = fullName
      if (asl !== undefined && asl !== null) updates.asl = asl
      await supabaseAdmin.from('profiles').update(updates).eq('id', userId)
      result = { ok: true }
    }

    else if (action === 'delete') {
      await supabaseAdmin.from('profiles').delete().eq('id', userId)
      await supabaseAdmin.auth.admin.deleteUser(userId)
      result = { ok: true }
    }

    else {
      throw new Error('Unknown action')
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})