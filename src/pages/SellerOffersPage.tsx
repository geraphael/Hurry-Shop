import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../lib/auth'
import { fetchOffersForSeller, updateOfferStatus } from '../lib/db'

export function SellerOffersPage() {
  const { profile } = useAuth()
  const queryClient = useQueryClient()

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ['seller-offers', profile?.id],
    queryFn: () => fetchOffersForSeller(profile!.id),
    enabled: Boolean(profile?.id),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACCEPTED' | 'REJECTED' }) =>
      updateOfferStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-offers', profile?.id] })
    },
  })

  return (
    <main className="mt-6">
      <section className="card">
        <div className="section-title">
          <h2>Offers received</h2>
          <span className="text-muted">Review and respond to offers on your listings.</span>
        </div>
        {isLoading ? (
          <p className="text-muted">Loading offers…</p>
        ) : !offers.length ? (
          <p className="text-muted">No offers received yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
            {offers.map((offer) => (
              <div key={offer.id} className="card" style={{ padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>{offer.listing?.title ?? 'Unknown listing'}</h4>
                    <p className="text-muted">
                      From: {offer.buyer?.full_name ?? offer.buyer_id} — KSh {offer.amount.toLocaleString()}
                    </p>
                    {offer.message && <p className="text-muted" style={{ fontStyle: 'italic' }}>"{offer.message}"</p>}
                    <p className="text-muted">{new Date(offer.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`tag ${offer.status === 'PENDING' ? '' : offer.status === 'ACCEPTED' ? '' : ''}`} style={{
                    background: offer.status === 'ACCEPTED' ? 'rgba(16,185,129,0.12)' : offer.status === 'REJECTED' ? 'rgba(239,68,68,0.12)' : 'rgba(251,191,36,0.12)',
                    color: offer.status === 'ACCEPTED' ? '#34d399' : offer.status === 'REJECTED' ? '#f87171' : '#fbbf24',
                  }}>
                    {offer.status}
                  </span>
                </div>
                {offer.status === 'PENDING' && (
                  <div className="button-group mt-3">
                    <button type="button" className="primary" onClick={() => updateMutation.mutate({ id: offer.id, status: 'ACCEPTED' })}>
                      Accept
                    </button>
                    <button type="button" className="secondary" onClick={() => updateMutation.mutate({ id: offer.id, status: 'REJECTED' })}>
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}