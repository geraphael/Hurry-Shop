import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchAdminStats, fetchPendingListings, approveListing, rejectListing, fetchPendingSellerRequests, fetchOpenReports } from '../lib/db'
import type { Listing, UserProfile, Report } from '../types'

export function DashboardPage() {
  const queryClient = useQueryClient()

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchAdminStats,
  })
  const { data: pendingListings = [] } = useQuery<Listing[]>({
    queryKey: ['pending-listings'],
    queryFn: fetchPendingListings,
  })
  const { data: pendingSellers = [] } = useQuery<UserProfile[]>({
    queryKey: ['pending-sellers'],
    queryFn: fetchPendingSellerRequests,
  })
  const { data: openReports = [] } = useQuery({
    queryKey: ['open-reports'],
    queryFn: () => fetchOpenReports(),
  }) as { data: Report[]; isLoading: boolean }

  const handleApprove = async (listingId: string) => {
    await approveListing(listingId)
    await queryClient.invalidateQueries({ queryKey: ['pending-listings'] })
    await queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
  }

  const handleReject = async (listingId: string) => {
    const reason = window.prompt('Rejection reason')
    if (!reason) return
    await rejectListing(listingId, reason)
    await queryClient.invalidateQueries({ queryKey: ['pending-listings'] })
    await queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
  }

  return (
    <main className="mt-6">
      <section className="card">
        <div className="section-title">
          <div>
            <h2>HURY SHOP ADMIN</h2>
            <p className="text-muted">Review pending listings and monitor campus marketplace activity.</p>
          </div>
        </div>
        <div className="grid grid-3 mt-6">
          {loadingStats ? (
            <p className="text-muted">Loading dashboard…</p>
          ) : (
            [
              { label: 'Users', value: stats?.users ?? 0 },
              { label: 'Verified Sellers', value: stats?.verifiedSellers ?? 0 },
              { label: 'Pending Sellers', value: stats?.pendingSellers ?? 0 },
              { label: 'Active Listings', value: stats?.activeListings ?? 0 },
              { label: 'Pending Listings', value: stats?.pendingListings ?? 0 },
              { label: 'Reports', value: stats?.reports ?? 0 },
            ].map((stat) => (
              <div key={stat.label} className="card stat-card">
                <p className="text-muted">{stat.label}</p>
                <h3>{stat.value}</h3>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="card mt-6">
        <div className="section-title">
          <h3>Pending listings</h3>
          <span className="text-muted">Approve or reject new listings before they appear in the marketplace.</span>
        </div>
        {pendingListings.length ? (
          <div className="grid grid-2 gap-4 mt-4">
            {pendingListings.map((listing) => (
              <div key={listing.id} className="card admin-listing-card">
                <div className="listing-header">
                  <div>
                    <h4>{listing.title}</h4>
                    <p className="text-muted">{listing.category.name} • {listing.condition}</p>
                  </div>
                  <p className="tag">{listing.status}</p>
                </div>
                <p className="price">KSh {listing.price.toLocaleString()}</p>
                <p className="text-muted">Seller: {listing.seller.full_name}</p>
                <p className="text-muted">Campus: {listing.campus_location}</p>
                <div className="button-group mt-4">
                  <button type="button" className="primary" onClick={() => handleApprove(listing.id)}>
                    Approve
                  </button>
                  <button type="button" className="secondary" onClick={() => handleReject(listing.id)}>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted mt-4">No pending listings at the moment.</p>
        )}
      </section>

      <section className="card mt-6">
        <div className="section-title">
          <h3>Pending seller requests</h3>
          <span className="text-muted">Review users asking to become verified campus sellers.</span>
        </div>
        {pendingSellers.length ? (
          <div className="grid grid-2 gap-4 mt-4">
            {pendingSellers.map((seller) => (
              <div key={seller.id} className="card admin-listing-card">
                <h4>{seller.full_name}</h4>
                <p className="text-muted">{seller.email}</p>
                <p className="text-muted">Campus: {seller.campus || 'Not provided'}</p>
                <p className="text-muted">Joined {new Date(seller.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted mt-4">No pending seller verification requests.</p>
        )}
      </section>

      <section className="card mt-6">
        <div className="section-title">
          <h3>Open reports</h3>
          <span className="text-muted">Review unresolved listing reports from campus users.</span>
        </div>
        {openReports.length ? (
          <div className="grid grid-2 gap-4 mt-4">
            {openReports.map((report) => (
              <div key={report.id} className="card admin-listing-card">
                <p className="tag">{report.reason}</p>
                <h4>{report.listing?.title ?? 'Reported item'}</h4>
                <p className="text-muted">Reported by: {report.reporter?.full_name ?? report.reporter_id}</p>
                <p className="text-muted">Details: {report.details ?? 'No details provided'}</p>
                <p className="text-muted">Submitted {new Date(report.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted mt-4">No open reports at the moment.</p>
        )}
      </section>
    </main>
  )
}
