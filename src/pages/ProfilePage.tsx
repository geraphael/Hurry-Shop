import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../lib/auth'
import { fetchUserProfile, fetchUserListings } from '../lib/db'
import { ProductCard } from '../components/ProductCard'
import type { Listing, UserProfile } from '../types'

export function ProfilePage() {
  const { id } = useParams()
  const { profile } = useAuth()
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
          <h3>Active listings</h3>
          {loadingListings ? (
            <p className="text-muted">Loading listings…</p>
          ) : listings?.length ? (
            <div className="grid grid-3 gap-4 mt-4">
              {listings.map((listing) => (
                <ProductCard
                  key={listing.id}
                  id={listing.id}
                  title={listing.title}
                  price={`KSh ${listing.price.toLocaleString()}`}
                  condition={listing.condition}
                  location={listing.campus_location}
                  seller={userProfile.full_name}
                  verified={userProfile.verification_status === 'VERIFIED'}
                  image={listing.cover_url ?? undefined}
                />
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
            <button type="button" className="primary" onClick={() => window.alert('Request sent to admin for review.')}>Request verification</button>
          </div>
        )}
      </section>
    </main>
  )
}
