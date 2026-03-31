'use client'

import { completeOnboarding } from '../actions'
import { useState } from 'react'

export default function OnboardingPage() {
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    const res = await completeOnboarding(formData)
    if (res?.error) setError(res.error)
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold font-serif text-ink text-center mb-2">Completiamo il tuo profilo</h2>
      <p className="text-warmGray text-center text-sm mb-6">
        Raccontaci qualcosa di te per personalizzare l'esperienza su Likhit.
      </p>
      
      {error && (
        <div className="bg-rust/10 text-rust px-4 py-2 rounded-soft mb-6 text-sm text-center">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-warmGray mb-2" htmlFor="nome">
            Come ti chiami? (Nome d'arte o reale)
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            required
            className="w-full px-4 py-2 bg-cream border border-sand rounded-soft focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta text-ink"
            placeholder="Es. Mario Rossi"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-warmGray mb-2" htmlFor="genere_scrittura">
            Qual è il tuo genere di scrittura principale?
          </label>
          <select
            id="genere_scrittura"
            name="genere_scrittura"
            required
            className="w-full px-4 py-2 bg-cream border border-sand rounded-soft focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta text-ink appearance-none"
          >
            <option value="" disabled selected>Seleziona un genere...</option>
            <option value="Narrativa Generale">Narrativa Generale</option>
            <option value="Romanzo Storico">Romanzo Storico</option>
            <option value="Fantastico / Sci-Fi">Fantastico / Sci-Fi</option>
            <option value="Giallo / Thriller">Giallo / Thriller</option>
            <option value="Romance">Romance</option>
            <option value="Saggistica">Saggistica</option>
            <option value="Poesia">Poesia</option>
            <option value="Altro">Altro</option>
          </select>
        </div>

        <button type="submit" className="btn-primary w-full">
          Entra in Likhit
        </button>
      </form>
    </div>
  )
}
