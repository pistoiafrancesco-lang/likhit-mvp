import Link from 'next/link'

interface Props {
  id: string
  titolo: string
  stato: 'in_analisi' | 'completato' | 'errore'
  dataCreazione: Date
}

export function ManoscrittoCard({ id, titolo, stato, dataCreazione }: Props) {
  return (
    <div className="card-base flex flex-col justify-between hover:border-terracotta transition-colors shadow-sm">
      <div className="mb-4">
        <h3 className="font-serif font-bold text-lg text-ink line-clamp-2">{titolo}</h3>
        <p className="text-xs text-warmGray mt-1 font-mono">
          Caricato il {dataCreazione.toLocaleDateString('it-IT')}
        </p>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div>
          {stato === 'in_analisi' && <span className="badge-analysis animate-pulse">In analisi (AI)</span>}
          {stato === 'completato' && <span className="badge-completed">Completato</span>}
          {stato === 'errore' && <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">Errore</span>}
        </div>
        
        {stato === 'completato' && (
          <Link href={`/manoscritto/${id}`} className="text-sm font-bold text-terracotta hover:text-rust underline-offset-4 hover:underline">
            Vedi Scheda &rarr;
          </Link>
        )}
      </div>
    </div>
  )
}
