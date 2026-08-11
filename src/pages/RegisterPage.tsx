import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    })

    if (error) {
      setError(error.message)
      return
    }

    if (data.user) {
      await supabase.from('profiles').insert([
        {
          id: data.user.id,
          email,
          full_name: name,
          campus: '',
          bio: '',
          role: 'user',
        },
      ])
      navigate('/')
    }
  }

  return (
    <main className="mt-6">
      <section className="card max-w-md mx-auto">
        <h2>Register</h2>
        <p className="text-muted">Join Hury Shop and start selling on campus.</p>
        <form onSubmit={handleSubmit} className="grid gap-4 mt-6">
          <label>
            Full name
            <input type="text" value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label>
            Campus email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {error && <p className="text-error">{error}</p>}
          <button type="submit" className="primary">
            Create account
          </button>
        </form>
      </section>
    </main>
  )
}
