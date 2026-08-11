import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ProductCard } from '../components/ProductCard'
import { fetchApprovedListings, fetchCategories } from '../lib/db'
import type { Category, Listing } from '../types'

export function HomePage() {
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<number | null>(null)

  const { data: featured, isLoading: loadingFeatured } = useQuery<Listing[]>({
    queryKey: ['featured-listings'],
    queryFn: () => fetchApprovedListings(),
    staleTime: 1000 * 60,
  })

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  })

  const filteredCategories = (categories ?? []).slice(0, 8)

  return (
    <main className="mt-6">
      <section className="card hero-card">
        <div>
          <h1>Hury Shop</h1>
          <p>Buy. Sell. Connect. Discover campus listings without a payment platform.</p>
          <div className="button-group mt-4">
            <a href="#explore" className="primary">
              Explore listings
            </a>
            <a href="/sell" className="secondary">
              Sell an item
            </a>
          </div>
        </div>
      </section>

      <section className="card mt-6">
        <div className="section-title">
          <div>
            <h2>Search marketplace</h2>
            <p className="text-muted">Search products, services and sellers across campus.</p>
          </div>
        </div>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search products, services and sellers..."
        />
      </section>

      <section className="mt-6">
        <div className="section-title">
          <h2>Categories</h2>
        </div>
        <div className="category-scroll">
          {(filteredCategories as Category[]).map((category) => (
            <button
              key={category.id}
              type="button"
              className={`tag ${categoryId === category.id ? 'tag-active' : ''}`}
              onClick={() => setCategoryId(categoryId === category.id ? null : category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6" id="explore">
        <div className="section-title">
          <h2>Featured listings</h2>
          <span className="text-muted">Newly approved items from your campus community.</span>
        </div>
        {loadingFeatured ? (
          <p className="text-muted">Loading featured listings…</p>
        ) : (
          <div className="grid grid-2">
            {(featured ?? []).slice(0, 4).map((listing) => (
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

      <section className="mt-6">
        <div className="section-title">
          <h2>Latest approved listings</h2>
        </div>
        <div className="grid grid-3">
          {(featured ?? []).slice(0, 6).map((listing) => (
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
      </section>
    </main>
  )
}
