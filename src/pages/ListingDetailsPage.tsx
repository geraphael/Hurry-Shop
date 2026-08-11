import { useParams } from 'react-router-dom'

export function ListingDetailsPage() {
  const { id } = useParams()

  return (
    <main className="mt-6">
      <section className="card max-w-3xl mx-auto">
        <div className="section-title">
          <h2>Listing details</h2>
          <span className="text-muted">This is a placeholder for listing {id}.</span>
        </div>
        <div className="grid grid-2 gap-6 mt-6">
          <div className="card-image">
            <img src="https://images.unsplash.com/photo-1512499617640-c2f99912a0ab?auto=format&fit=crop&w=1200&q=60" alt="Listing" />
          </div>
          <div>
            <h3>Sample product title</h3>
            <p className="price">KSh 25,000</p>
            <p className="text-muted">Good condition • Baraton Campus</p>
            <div className="button-group mt-4">
              <button className="primary">Contact seller</button>
              <button className="secondary">Make offer</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
