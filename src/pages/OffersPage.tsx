import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../lib/auth'
import { fetchOffersByBuyer } from '../lib/db'
import type { Offer } from '../types'

export function OffersPage() {
  const { profile } = useAuth()

  const { data: offers, isLoading } = useQuery<Offer[]>({
    queryKey: ['offers', profile?.id],
    queryFn: () => fetchOffersByBuyer(profile!.id),
    enabled: Boolean(profile?.id),
  })

  return (
    <main className="mt-6">
      <section className="card">
        <div className="section-title">
          <h2>My Offers</h2>
          <span className="text-muted">Track your submitted offers and bid requests.</span>
        </div>
        {isLoading ? (
          <p className="text-muted">Loading your offers…</p>
        ) : !offers?.length ? (
          <p className="text-muted">You have not made any offers yet.</p>
        ) : (
          <div className="grid grid-2 gap-4 mt-6">
            {offers.map((offer) => (
              <div key={offer.id} className="card listing-summary">
                <p className="tag">{offer.status}</p>
                <h3>{offer.listing?.title ?? 'Listing'}</h3>
                <p className="text-muted">Offer: KSh {offer.amount.toLocaleString()}</p>
                <p className="text-muted">Submitted {new Date(offer.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
