import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchAdminStats, fetchPendingListings, approveListing, rejectListing, fetchPendingSellerRequests, fetchOpenReports } from '../lib/db'
import type { Listing, UserProfile, Report } from '../types'

/* ─── Helpers ─────────────────────────────────────────── */

function StatCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="admin-stat-cell">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
    </div>
  )
}

function formatDate(raw: string) {
  return new Date(raw).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/* ─── Component ───────────────────────────────────────── */

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

  /* ── Actions ──────────────────────────────────────── */

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

  /* ── Render ───────────────────────────────────────── */

  return (
    <main className="admin-page">

      {/* ── Terminal Header ─────────────────────────── */}
      <div className="admin-header">
        <h2>
          █ hury-shop admin panel
          <span className="cursor-block" />
        </h2>
        <p className="subtitle">
          $ systemctl status marketplace — campus review terminal v1.0
        </p>
      </div>

      {/* ── Stats Grid ──────────────────────────────── */}
      <div className="admin-stats-grid">
        {loadingStats ? (
          <p className="admin-empty" style={{ gridColumn: '1 / -1' }}>⏳ loading stats…</p>
        ) : (
          <>
            <StatCell label="Users" value={stats?.users ?? 0} />
            <StatCell label="Verified Sellers" value={stats?.verifiedSellers ?? 0} />
            <StatCell label="Pending Sellers" value={stats?.pendingSellers ?? 0} />
            <StatCell label="Active Listings" value={stats?.activeListings ?? 0} />
            <StatCell label="Pending Listings" value={stats?.pendingListings ?? 0} />
            <StatCell label="Reports" value={stats?.reports ?? 0} />
          </>
        )}
      </div>

      {/* ── Pending Listings Panel ──────────────────── */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h3>📋 Pending listings</h3>
          <span className="badge">{pendingListings.length} items</span>
        </div>
        <div className="admin-panel-body">
          {pendingListings.length ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {pendingListings.map((listing) => (
                <div key={listing.id} className="admin-item-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div>
                      <h4>{listing.title}</h4>
                      <p className="meta-line">
                        {listing.category.name} &mdash; {listing.condition}
                      </p>
                    </div>
                    <span className="admin-tag admin-tag-pending">{listing.status}</span>
                  </div>
                  <p className="price-line">KSh {listing.price.toLocaleString()}</p>
                  <p className="meta-line">seller: {listing.seller.full_name}</p>
                  <p className="meta-line">campus: {listing.campus_location}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.7rem' }}>
                    <button type="button" className="admin-btn admin-btn-approve" onClick={() => handleApprove(listing.id)}>
                      ✓ approve
                    </button>
                    <button type="button" className="admin-btn admin-btn-reject" onClick={() => handleReject(listing.id)}>
                      ✗ reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="admin-empty">∅ no pending listings</p>
          )}
        </div>
      </div>

      {/* ── Pending Sellers Panel ───────────────────── */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h3>👤 Seller verification requests</h3>
          <span className="badge">{pendingSellers.length} items</span>
        </div>
        <div className="admin-panel-body">
          {pendingSellers.length ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {pendingSellers.map((seller) => (
                <div key={seller.id} className="admin-item-card">
                  <h4>{seller.full_name}</h4>
                  <p className="meta-line">email: {seller.email}</p>
                  <p className="meta-line">campus: {seller.campus || '—'}</p>
                  <p className="meta-line">joined: {formatDate(seller.created_at)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="admin-empty">∅ no pending seller requests</p>
          )}
        </div>
      </div>

      {/* ── Open Reports Panel ──────────────────────── */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h3>⚠️ Open reports</h3>
          <span className="badge">{openReports.length} items</span>
        </div>
        <div className="admin-panel-body">
          {openReports.length ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {openReports.map((report) => (
                <div key={report.id} className="admin-item-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <h4>{report.listing?.title ?? 'Unknown listing'}</h4>
                    <span className="admin-tag admin-tag-open">{report.reason}</span>
                  </div>
                  <p className="meta-line">reported by: {report.reporter?.full_name ?? report.reporter_id}</p>
                  <p className="meta-line">details: {report.details ?? 'no details'}</p>
                  <p className="meta-line">submitted: {formatDate(report.created_at)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="admin-empty">∅ no open reports</p>
          )}
        </div>
      </div>

    </main>
  )
}
