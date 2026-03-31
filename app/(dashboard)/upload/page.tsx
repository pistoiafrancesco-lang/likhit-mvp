import { UploadForm } from '@/components/UploadForm'

export default function UploadPage() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h1 className="text-3xl font-serif font-bold text-ink mb-2 text-center">Inizia una nuova Analisi</h1>
      <p className="text-warmGray text-center max-w-xl mb-6">
        L'intelligenza artificiale di Likhit ha bisogno del tuo manoscritto in formato testuale (.pdf, .docx). Nessun file viene ceduto ad editori terzi o divulgato senza il tuo permesso.
      </p>
      
      <UploadForm />
    </div>
  )
}
