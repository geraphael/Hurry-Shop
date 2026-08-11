import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="mt-6">
      <section className="card max-w-md mx-auto text-center">
        <h2>Page not found</h2>
        <p className="text-muted">The page you are looking for does not exist.</p>
        <Link to="/" className="primary">
          Return home
        </Link>
      </section>
    </main>
  )
}
