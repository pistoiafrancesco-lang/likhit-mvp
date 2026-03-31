import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col pt-12">
      <header className="px-8 py-4 flex justify-between items-center max-w-5xl mx-auto w-full">
        <Logo />
        <nav className="flex gap-4">
          <button className="btn-secondary">Accedi</button>
          <button className="btn-primary">Inizia ora</button>
        </nav>
      </header>
      
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 mt-16 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-ink">
          La tua storia merita di essere letta.
        </h1>
        <p className="text-warmGray text-lg md:text-xl mb-12 max-w-2xl">
          Likhit è il marketplace letterario AI-powered che connette autori inediti con le case editrici italiane. Ottieni una scheda editoriale professionale per il tuo manoscritto in pochi minuti.
        </p>
        
        <div className="card-base w-full max-w-lg mb-8">
          <h2 className="text-xl font-bold mb-4 font-serif">Valuta il tuo Manoscritto</h2>
          <div className="input-upload mb-4">
            <p className="text-warmGray font-mono text-sm">Trascina qui il tuo file (.pdf o .docx)</p>
            <p className="text-sienna text-xs mt-2 font-bold cursor-pointer">Oppure clicca per sfogliare</p>
          </div>
          <button className="btn-primary w-full">Analizza Manoscritto</button>
        </div>

        <div className="flex gap-4 mt-8">
          <span className="badge-analysis">In analisi</span>
          <span className="badge-completed">Completato</span>
        </div>
      </section>
    </main>
  );
}
