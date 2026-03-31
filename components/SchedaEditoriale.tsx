'use client'

import { PotenzialeMeter } from './PotenzialeMeter'

interface SchedaData {
  genere: string
  pubblico_target: string
  tono_stile: string
  trama: string
  punti_forza: string[]
  aree_miglioramento: string[]
  comparables: string[]
  potenziale_commerciale: number
  potenziale_note: string
  tag_semantici: any
}

interface Props {
  titoloManoscritto: string
  data: SchedaData
}

export function SchedaEditoriale({ titoloManoscritto, data }: Props) {
  const printPdf = () => {
    window.print()
  }

  return (
    <div className="bg-cream min-h-screen pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 mt-10">
        
        {/* Header (not printed) */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          <button onClick={() => window.history.back()} className="text-warmGray hover:text-ink">
            &larr; Torna alla Dashboard
          </button>
          <button onClick={printPdf} className="btn-secondary">
            Scarica PDF
          </button>
        </div>

        {/* The Printable Card */}
        <div className="card-base shadow-sm print:shadow-none print:border-none print:bg-white print:m-0 print:p-0">
          
          <div className="border-b border-sand pb-8 mb-8">
            <h1 className="text-sm font-mono text-terracotta mb-2 uppercase tracking-wider">
              Scheda Editoriale Likhit
            </h1>
            <h2 className="text-4xl font-serif font-bold text-ink leading-tight">
              {titoloManoscritto}
            </h2>
            <div className="flex flex-wrap gap-2 mt-4">
              {data.tag_semantici?.generi?.map((tag: string) => (
                <span key={tag} className="badge-completed bg-[#F2EBE0] text-warmGray border border-sand">{tag}</span>
              ))}
              <span className="badge-completed bg-[#F2EBE0] text-warmGray border border-sand">{data.tag_semantici?.lunghezza_stimata}</span>
              <span className="badge-completed bg-[#F2EBE0] text-warmGray border border-sand">Età: {data.tag_semantici?.pubblico_eta}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Colonna Sinistra */}
            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-serif font-bold text-ink mb-2">Genere e Target</h3>
                <p className="text-warmGray leading-relaxed"><strong className="text-ink">Genere:</strong> {data.genere}</p>
                <p className="text-warmGray leading-relaxed mt-2"><strong className="text-ink">Pubblico:</strong> {data.pubblico_target}</p>
              </section>

              <section>
                <h3 className="text-lg font-serif font-bold text-ink mb-2">Tono e Stile</h3>
                <p className="text-warmGray leading-relaxed">{data.tono_stile}</p>
              </section>

              <section>
                <h3 className="text-lg font-serif font-bold text-ink mb-2">Trama</h3>
                <p className="text-warmGray leading-relaxed">{data.trama}</p>
              </section>
            </div>

            {/* Colonna Destra */}
            <div className="space-y-8">
              <section className="bg-[#FAF7F2] p-6 rounded-soft border border-sand print:border-ink print:bg-white">
                <h3 className="text-lg font-serif font-bold text-ink mb-4">Potenziale Commerciale</h3>
                <PotenzialeMeter punteggio={data.potenziale_commerciale} />
                <p className="text-warmGray leading-relaxed mt-4 italic">
                  "{data.potenziale_note}"
                </p>
              </section>

              <section>
                <h3 className="text-lg font-serif font-bold text-ink mb-2">Punti di Forza</h3>
                <ul className="list-disc pl-5 space-y-2 text-warmGray">
                  {data.punti_forza.map((punto, i) => <li key={i}>{punto}</li>)}
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-serif font-bold text-ink mb-2">Aree di Miglioramento</h3>
                <ul className="list-disc pl-5 space-y-2 text-warmGray">
                  {data.aree_miglioramento.map((punto, i) => <li key={i}>{punto}</li>)}
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-serif font-bold text-ink mb-2">Titoli Comparabili (Mercato IT)</h3>
                <ul className="list-disc pl-5 space-y-2 text-warmGray">
                  {data.comparables.map((comp, i) => <li key={i} className="font-mono text-sm">{comp}</li>)}
                </ul>
              </section>

            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-sand text-center text-xs text-warmGray">
            Generato automaticamente dall'intelligenza editoriale di Likhit.com
          </div>
        </div>
      </div>
    </div>
  )
}
