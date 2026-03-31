'use server'

import { createSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  if (!email || !password) return { error: 'Email e Password sono obbligatori' }

  const supabase = createSupabaseClient()
  
  // Register (con email confirm OFF come confermato dal "ok")
  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Redirect to onboarding so they can set name and genre
  redirect('/onboarding')
}

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) return { error: 'Email e Password sono obbligatori' }

  const supabase = createSupabaseClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'Credenziali non valide.' }
  }

  // Assumiamo che se ha un profilo vada in dashboard, altrimenti l'onboarding gestirà il fallback (o viceversa)
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = createSupabaseClient()
  await supabase.auth.signOut()
  return redirect('/login')
}

export async function completeOnboarding(formData: FormData) {
  const nome = formData.get('nome') as string
  const genere = formData.get('genere_scrittura') as string

  if (!nome || !genere) return { error: 'Tutti i campi sono obbligatori' }

  const supabase = createSupabaseClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return redirect('/login')
  }

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    nome,
    genere_scrittura: genere,
  })

  if (error) {
    return { error: 'Errore durante il salvataggio del profilo. Riprova.' }
  }

  redirect('/dashboard')
}
