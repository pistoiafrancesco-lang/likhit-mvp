'use client'

import { signIn } from '../actions'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    const res = await signIn(formData)
    if (res?.error) setError(res.error)
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold font-serif text-ink text-center mb-6">Bentornato</h2>
      
      {error && (
        <div className="bg-rust/10 text-rust px-4 py-2 rounded-soft mb-6 text-sm text-center">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-warmGray mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-4 py-2 bg-cream border border-sand rounded-soft focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta text-ink"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-warmGray mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full px-4 py-2 bg-cream border border-sand rounded-soft focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta text-ink"
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="btn-primary w-full">
          Accedi
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-warmGray">
        Non hai un account?{' '}
        <Link href="/register" className="font-semibold text-terracotta hover:text-rust">
          Registrati
        </Link>
      </p>
    </div>
  )
}
