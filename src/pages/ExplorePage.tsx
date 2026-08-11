import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ProductCard } from '../components/ProductCard'
import { fetchApprovedListings, fetchCategories } from '../lib/db'
import type { Category, Listing } from '../types'

export function ExplorePage() {
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<number | null>(null)

  const { data: listings, isLoading } = useQuery<Listing[]>({
    queryKey: ['approved-listings', search, categoryId],
    queryFn: () => fetchApprovedListings(search, categoryId ?? undefined),
  })

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  })

  return (
    <main className="mt-6">
      <section className="card">
        <div className="section-title">
          <div>
            <h2>Explore marketplace</h2>
            <p className="text-muted">Browse approved products and campus services.</p>
          </div>
        </div>
        <div className="grid grid-2 gap-4 mt-4">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search approved listings..."
          />
          <select value={categoryId ?? ''} onChange={(event) => setCategoryId(event.target.value ? Number(event.target.value) : null)}>
            <option value="">All categories</option>
            {categories?.map((category: Category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        {isLoading ? (
          <p className="text-muted mt-6">Loading marketplace…</p>
        ) : (
          <div className="grid grid-3 mt-6">
            {listings?.map((listing) => (
              <ProductCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                price={`KSh ${listing.price.toLocaleString()}`}
                condition={listing.condition}
                location={listing.campus_location}
                seller={listing.seller.full_name}
                verified={listing.seller.verification_status === 'VERIFIED'}
                image={listing.cover_url ?? undefined}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
