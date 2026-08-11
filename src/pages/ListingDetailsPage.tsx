import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchListingById, createOffer, reportListing, sendMessage } from '../lib/db'
import type { Listing } from '../types'

export function ListingDetailsPage() {
  const { id } = useParams()
  const { profile } = useAuth()
  const queryClient = useQueryClient()
  const [offerAmount, setOfferAmount] = useState('')
  const [offerMessage, setOfferMessage] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [showReportForm, setShowReportForm] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportDetails, setReportDetails] = useState('')
  const [contactMsg, setContactMsg] = useState('')
  const [showContact, setShowContact] = useState(false)

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
      setOfferMessage('')
      if (id) queryClient.invalidateQueries({ queryKey: ['listing', id] })
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
      setShowReportForm(false)
      setReportReason('')
      setReportDetails('')
    },
    onError: (error: Error) => {
      setFeedback(error.message ?? 'Unable to submit report.')
    },
  })

  const contactMutation = useMutation({
    mutationFn: () =>
      sendMessage({
        listing_id: listing!.id,
        sender_id: profile!.id,
        receiver_id: listing!.seller.id,
        body: contactMsg.trim(),
      }),
    onSuccess: () => {
      setFeedback('Message sent to the seller! Check your Messages tab.')
      setContactMsg('')
      setShowContact(false)
    },
    onError: (error: Error) => {
      setFeedback(error.message ?? 'Unable to send message.')
    },
  })

  const handleOffer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!profile || !listing) return
    offerMutation.mutate({
      listing_id: listing.id,
      buyer_id: profile.id,
      amount: Number(offerAmount),
      message: offerMessage.trim() || undefined,
    })
  }

  const handleReport = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!profile || !listing || !reportReason) return
    reportMutation.mutate({ reason: reportReason, details: reportDetails })
  }

  const isOwner = profile?.id === listing?.seller.id

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
            <p className="text-muted">
              Seller: {listing.seller.full_name}
              {listing.seller.verification_status === 'VERIFIED' && ' ✓ Verified Seller'}
            </p>
            <p className="text-muted">Posted on {new Date(listing.created_at).toLocaleDateString()}</p>
            <p className="mt-4">{listing.description}</p>

            {feedback && <p className="text-muted mt-3">{feedback}</p>}

            {/* ── Contact Seller ── */}
            {profile && !isOwner && (
              <div className="mt-4">
                {showContact ? (
                  <div className="grid gap-2">
                    <textarea
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      rows={2}
                      placeholder="Hi, I'm interested in your listing…"
                    />
                    <div className="button-group">
                      <button type="button" className="primary" onClick={() => contactMutation.mutate()} disabled={!contactMsg.trim()}>
                        Send
                      </button>
                      <button type="button" className="secondary" onClick={() => setShowContact(false)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button type="button" className="primary" onClick={() => setShowContact(true)}>
                    ✉ Contact seller
                  </button>
                )}
              </div>
            )}

            {/* ── Make Offer ── */}
            {profile && !isOwner && (
              <form onSubmit={handleOffer} className="grid gap-3 mt-4">
                <hr className="divider" />
                <h4>Make an offer</h4>
                <div className="grid grid-2 gap-3">
                  <input
                    type="number"
                    min="1"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    placeholder="Amount (KSh)"
                    required
                  />
                </div>
                <textarea
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  rows={2}
                  placeholder="Optional message"
                />
                <button type="submit" className="primary" disabled={!offerAmount}>Submit offer</button>
              </form>
            )}

            {/* ── Report ── */}
            <div className="mt-4">
              {showReportForm ? (
                <form onSubmit={handleReport} className="grid gap-2">
                  <select value={reportReason} onChange={(e) => setReportReason(e.target.value)} required>
                    <option value="">Select a reason</option>
                    <option value="SPAM">Spam</option>
                    <option value="INAPPROPRIATE">Inappropriate content</option>
                    <option value="MISLEADING">Misleading listing</option>
                    <option value="DUPLICATE">Duplicate listing</option>
                    <option value="OTHER">Other</option>
                  </select>
                  <textarea
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    rows={2}
                    placeholder="Additional details (optional)"
                  />
                  <div className="button-group">
                    <button type="submit" className="secondary" disabled={!reportReason}>Submit report</button>
                    <button type="button" className="secondary" onClick={() => setShowReportForm(false)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <button type="button" className="secondary" onClick={() => setShowReportForm(true)}>
                  ⚑ Report listing
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
