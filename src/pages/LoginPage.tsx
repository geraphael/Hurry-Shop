import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      return
    }

    navigate('/')
  }

  return (
    <main className="mt-6">
      <section className="card max-w-md mx-auto">
        <h2>Login</h2>
        <p className="text-muted">Access your campus listings and messages.</p>
        <form onSubmit={handleSubmit} className="grid gap-4 mt-6">
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {error && <p className="text-error">{error}</p>}
          <button type="submit" className="primary">
            Login
          </button>
        </form>
        <p className="text-muted mt-4">
          New to Hury Shop? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  )
}
