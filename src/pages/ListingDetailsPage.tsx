import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchListingById, createOffer, reportListing } from '../lib/db'
import type { Listing } from '../types'

export function ListingDetailsPage() {
  const { id } = useParams()
  const { profile } = useAuth()
  const queryClient = useQueryClient()
  const [offerAmount, setOfferAmount] = useState('')
  const [message, setMessage] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)

  const { data: listing, isLoading } = useQuery<Listing>({
    queryKey: ['listing', id],
    queryFn: () => fetchListingById(id!),
    enabled: Boolean(id),
  })

  const offerMutation = useMutation({
    mutationFn: createOffer,
    onSuccess: () => {
      setFeedback('Offer sent to the seller. They will contact you directly.')
      setOfferAmount('')
      if (id) {
        queryClient.invalidateQueries({ queryKey: ['listing', id] })
      }
    },
    onError: (error: Error) => {
      setFeedback(error.message ?? 'Unable to send the offer.')
    },
  })

  const reportMutation = useMutation({
    mutationFn: (values: { reason: string; details?: string }) =>
      reportListing({
        reporter_id: profile!.id,
        listing_id: listing!.id,
        reported_user_id: listing!.seller.id,
        reason: values.reason,
        details: values.details,
      }),
    onSuccess: () => {
      setFeedback('Report submitted. Admin will review this listing.')
    },
    onError: (error: Error) => {
      setFeedback(error.message ?? 'Unable to submit report.')
    },
  })

  const handleOffer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!profile || !listing) {
      return
    }

    offerMutation.mutate({
      listing_id: listing.id,
      buyer_id: profile.id,
      amount: Number(offerAmount),
      message: message.trim() || undefined,
    })
  }

  if (isLoading) {
    return (
      <main className="mt-6">
        <p className="text-muted">Loading listing…</p>
      </main>
    )
  }

  if (!listing) {
    return (
      <main className="mt-6">
        <p className="text-muted">Listing not found.</p>
      </main>
    )
  }

  return (
    <main className="mt-6">
      <section className="card max-w-4xl mx-auto">
        <div className="section-title">
          <div>
            <h2>{listing.title}</h2>
            <p className="text-muted">{listing.category.name} • {listing.campus_location}</p>
          </div>
          <span className="tag">{listing.status}</span>
        </div>
        <div className="grid grid-2 gap-6 mt-6">
          <div className="card-image">
            <img src={listing.cover_url ?? 'https://images.unsplash.com/photo-1512499617640-c2f99912a0ab?auto=format&fit=crop&w=1200&q=60'} alt={listing.title} />
          </div>
          <div>
            <p className="price">KSh {listing.price.toLocaleString()}</p>
            <p className="text-muted">Condition: {listing.condition}</p>
            <p className="text-muted">Seller: {listing.seller.full_name}{listing.seller.verification_status === 'VERIFIED' && ' ✓ Verified Seller'}</p>
            <p className="text-muted">Posted on {new Date(listing.created_at).toLocaleDateString()}</p>
            <p className="mt-4">{listing.description}</p>
            <form onSubmit={handleOffer} className="grid gap-4 mt-6">
              <label>
                Offer amount (KSh)
                <input
                  type="number"
                  min="1"
                  value={offerAmount}
                  onChange={(event) => setOfferAmount(event.target.value)}
                  placeholder="Enter your offer"
                  required
                />
              </label>
              <label>
                Message to seller
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={4}
                  placeholder="Write a short message"
                />
              </label>
              <button type="submit" className="primary">
                Submit offer
              </button>
            </form>
            {feedback && <p className="text-muted mt-3">{feedback}</p>}
          </div>
        </div>
      </section>
    </main>
  )
}
