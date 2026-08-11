import { useParams } from 'react-router-dom'

export function ProfilePage() {
  const { id } = useParams()

  return (
    <main className="mt-6">
      <section className="card max-w-3xl mx-auto">
        <div className="section-title">
          <h2>User profile</h2>
          <span className="text-muted">Profile details for {id || 'current user'}.</span>
        </div>
        <div className="grid grid-2 gap-6 mt-6">
          <div className="card">
            <h3>Profile</h3>
            <p>Name: Sample User</p>
            <p>Campus: Baraton</p>
            <p>Status: Verified Seller</p>
          </div>
          <div className="card">
            <h3>Active listings</h3>
            <p>Sample Listing 1</p>
            <p>Sample Listing 2</p>
          </div>
        </div>
      </section>
    </main>
  )
}
