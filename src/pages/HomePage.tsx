import { ProductCard } from '../components/ProductCard'

const featured = [
  {
    id: '1',
    title: 'HP EliteBook 840',
    price: 'KSh 25,000',
    condition: 'Good',
    location: 'Baraton Campus',
    seller: 'Raphael',
    verified: true,
  },
  {
    id: '2',
    title: 'Samsung Galaxy A14',
    price: 'KSh 18,000',
    condition: 'Like New',
    location: 'Eldoret Campus',
    seller: 'Asha',
    verified: false,
  },
]

const categories = ['Electronics', 'Phones', 'Computers', 'Books', 'Fashion', 'Services']

export function HomePage() {
  return (
    <main className="mt-6">
      <section className="card hero-card">
        <div>
          <h1>Hury Shop</h1>
          <p>Buy, sell and connect with your campus community.</p>
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
          <h2>Search listings</h2>
          <span className="text-muted">Find products, services or verified sellers</span>
        </div>
        <input type="search" placeholder="Search products, services and sellers..." />
      </section>

      <section className="mt-6">
        <div className="section-title">
          <h2>Categories</h2>
        </div>
        <div className="category-scroll">
          {categories.map((category) => (
            <span key={category} className="tag">
              {category}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-6" id="explore">
        <div className="section-title">
          <h2>Featured listings</h2>
        </div>
        <div className="grid grid-2">
          {featured.map((item) => (
            <ProductCard key={item.id} {...item} image="https://images.unsplash.com/photo-1512499617640-c2f99912a0ab?auto=format&fit=crop&w=900&q=60" />
          ))}
        </div>
      </section>

      <section className="mt-6">
        <div className="section-title">
          <h2>Latest listings</h2>
        </div>
        <div className="grid grid-3">
          {featured.map((item) => (
            <ProductCard key={item.id} {...item} image="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=60" />
          ))}
        </div>
      </section>
    </main>
  )
}
