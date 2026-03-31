import { createSupabaseClient } from '@/lib/supabase-server'
import { ManoscrittoCard } from '@/components/ManoscrittoCard'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = createSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: manoscritti, error } = await supabase
    .from('manoscritti')
    .select('id, titolo, stato, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-serif text-ink">I tuoi manoscritti</h2>
          <p className="text-warmGray text-sm mt-1">Gestisci le schede editoriali generate dall'AI.</p>
        </div>
        <Link href="/upload" className="btn-primary">
          + Nuovo Upload
        </Link>
      </div>

      {!manoscritti || manoscritti.length === 0 ? (
        <div className="card-base text-center py-16">
          <h3 className="text-lg font-serif font-bold text-ink mb-2">Non hai ancora manoscritti</h3>
          <p className="text-warmGray text-sm mb-6">Carica il tuo primo documento in formato PDF o Word per ottenere immediata validazione.</p>
          <Link href="/upload" className="btn-secondary">
            Inizia il primo Upload
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {manoscritti.map((m: any) => (
            <ManoscrittoCard 
              key={m.id} 
              id={m.id} 
              titolo={m.titolo} 
              stato={m.stato} 
              dataCreazione={new Date(m.created_at)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
