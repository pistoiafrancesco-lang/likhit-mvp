'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Errore durante l\'upload')
      }

      // Reindirizzamento alla dashboard una volta avviato il processing
      router.push('/dashboard')
      router.refresh()

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mt-8 mb-8 card-base">
      <h2 className="text-xl font-bold font-serif text-ink mb-4">Sottoponi il tuo Manoscritto</h2>
      
      {error && (
        <div className="bg-rust/10 text-rust px-4 py-2 rounded-soft mb-4 text-sm text-center">
          {error}
        </div>
      )}

      <div 
        className={`input-upload mb-4 relative ${dragActive ? 'border-terracotta bg-cream' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
        />
        
        {file ? (
          <div>
            <p className="font-mono text-sm text-ink mb-2">File Selezionato:</p>
            <p className="font-bold text-terracotta">{file.name}</p>
            <p className="text-xs text-warmGray mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        ) : (
          <div>
            <p className="text-warmGray font-mono text-sm mb-2">Trascina qui il tuo file (.pdf o .docx)</p>
            <p className="text-sienna text-xs mt-2 font-bold focus:underline">Oppure clicca per sfogliare</p>
          </div>
        )}
      </div>

      <button 
        type="submit" 
        className={`btn-primary w-full ${(!file || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!file || loading}
      >
        {loading ? 'Caricamento ed Elaborazione...' : 'Analizza Manoscritto'}
      </button>
      
      <p className="text-xs text-warmGray mt-4 text-center">
        Max 10MB. Verranno analizzati dal modello Likhit i primi 50.000 caratteri del tuo testo.
      </p>
    </form>
  )
}
