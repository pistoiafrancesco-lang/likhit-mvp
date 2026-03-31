import { createSupabaseClient } from '@/lib/supabase-server'
import { SchedaEditoriale } from '@/components/SchedaEditoriale'
import { redirect } from 'next/navigation'

export default async function ManoscrittoPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: manoscritto, error: manoscrittoError } = await supabase
    .from('manoscritti')
    .select('titolo, stato')
    .eq('id', params.id)
    .single()

  if (manoscrittoError || !manoscritto) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <h2 className="text-2xl font-serif text-ink">Manoscritto non trovato.</h2>
      </div>
    )
  }

  if (manoscritto.stato === 'in_analisi') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-cream px-4">
        <span className="badge-analysis animate-pulse text-xl py-2 px-6 mb-6">Analisi in corso...</span>
        <h2 className="text-3xl font-serif text-ink mb-4 font-bold max-w-lg">
          L'editor sta leggendo "{manoscritto.titolo}"
        </h2>
        <p className="text-warmGray max-w-sm">
          A seconda della lunghezza del testo, l'operazione può richiedere dai 30 secondi a qualche minuto. 
          Ricarica la pagina per vederne l'esito.
        </p>
      </div>
    )
  }

  if (manoscritto.stato === 'errore') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-cream px-4">
        <span className="bg-red-100 text-red-700 font-bold px-4 py-1 rounded-full text-sm mb-6">Errore Analisi</span>
        <h2 className="text-2xl font-serif text-ink mb-4">Qualcosa è andato storto con "{manoscritto.titolo}"</h2>
        <p className="text-warmGray max-w-sm">
          Il testo potrebbe essere corrotto oppure c'è stato un problema imprevisto con i server AI. Per favore carica nuovamente il file.
        </p>
      </div>
    )
  }

  const { data: scheda, error: schedaError } = await supabase
    .from('schede')
    .select('*')
    .eq('manoscritto_id', params.id)
    .single()

  if (schedaError || !scheda) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <h2 className="text-xl text-warmGray">Generazione scheda completata ma impossibile da leggere dal database.</h2>
      </div>
    )
  }

  return (
    <SchedaEditoriale 
      titoloManoscritto={manoscritto.titolo} 
      data={scheda} 
    />
  )
}
