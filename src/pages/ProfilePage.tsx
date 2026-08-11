import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../lib/auth'
import { fetchUserProfile, fetchUserListings, deleteListing, createSellerRequest } from '../lib/db'
import { ProductCard } from '../components/ProductCard'
import type { Listing, UserProfile } from '../types'

export function ProfilePage() {
  const { id } = useParams()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const profileId = id === 'me' || !id ? profile?.id : id

  const { data: userProfile, isLoading: loadingProfile } = useQuery<UserProfile>({
    queryKey: ['profile', profileId],
    queryFn: () => fetchUserProfile(profileId!),
    enabled: Boolean(profileId),
  })

  const { data: listings, isLoading: loadingListings } = useQuery<Listing[]>({
    queryKey: ['user-listings', profileId],
    queryFn: () => fetchUserListings(profileId!),
    enabled: Boolean(profileId),
  })

  const isOwner = profileId === profile?.id

  const deleteMutation = useMutation({
    mutationFn: deleteListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-listings', profileId] })
    },
  })

  const verificationLabel = useMemo(() => {
    if (!userProfile) return 'Unknown'
    return userProfile.verification_status === 'VERIFIED' ? 'Verified Seller' : 'Member'
  }, [userProfile])

  if (loadingProfile) {
    return (
      <main className="mt-6">
        <p className="text-muted">Loading profile…</p>
      </main>
    )
  }

  if (!userProfile) {
    return (
      <main className="mt-6">
        <p className="text-muted">Profile not found.</p>
      </main>
    )
  }

  const handleDelete = (listingId: string, title: string) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      deleteMutation.mutate(listingId)
    }
  }

  return (
    <main className="mt-6">
      <section className="card max-w-4xl mx-auto">
        <div className="profile-header">
          <div>
            <h2>{userProfile.full_name}</h2>
            <p className="text-muted">{userProfile.campus || 'Campus not specified'}</p>
            <p className="tag">{verificationLabel}</p>
          </div>
          <div className="profile-meta">
            <p>Joined {new Date(userProfile.created_at).toLocaleDateString()}</p>
            <p>{userProfile.bio || 'No profile bio yet.'}</p>
          </div>
        </div>

        <div className="mt-6">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3>Active listings</h3>
            {isOwner && <button type="button" className="primary" onClick={() => navigate('/sell')}>+ New listing</button>}
          </div>
          {loadingListings ? (
            <p className="text-muted">Loading listings…</p>
          ) : listings?.length ? (
            <div className="grid grid-3 gap-4 mt-4">
              {listings.map((listing) => (
                <div key={listing.id} style={{ position: 'relative' }}>
                  <ProductCard
                    id={listing.id}
                    title={listing.title}
                    price={`KSh ${listing.price.toLocaleString()}`}
                    condition={listing.condition}
                    location={listing.campus_location}
                    seller={userProfile.full_name}
                    verified={userProfile.verification_status === 'VERIFIED'}
                    image={listing.cover_url ?? undefined}
                  />
                  {isOwner && (
                    <div className="button-group mt-2">
                      <button type="button" className="secondary" style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem' }} onClick={() => navigate(`/listing/${listing.id}`)}>
                        Edit
                      </button>
                      <button type="button" className="secondary" style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem', color: '#f87171' }} onClick={() => handleDelete(listing.id, listing.title)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No active listings yet.</p>
          )}
        </div>
        {isOwner && userProfile.verification_status === 'NOT_VERIFIED' && (
          <div className="card mt-6">
            <h3>Become a verified seller</h3>
            <p className="text-muted">Request seller verification so your listings can appear with the verified badge.</p>
            <button type="button" className="primary" onClick={() => {
              createSellerRequest(userProfile.id)
              window.alert('Verification request sent to admin.')
            }}>Request verification</button>
          </div>
        )}
      </section>
    </main>
  )
}
