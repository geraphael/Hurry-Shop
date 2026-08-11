import { ProductCard } from '../components/ProductCard'

const sample = [
  {
    id: '3',
    title: 'Dell Inspiron 15',
    price: 'KSh 22,500',
    condition: 'Fair',
    location: 'Main Campus',
    seller: 'Joan',
    verified: true,
  },
  {
    id: '4',
    title: 'Maths Textbooks',
    price: 'KSh 4,500',
    condition: 'Good',
    location: 'Mombasa Campus',
    seller: 'David',
    verified: false,
  },
]

export function ExplorePage() {
  return (
    <main className="mt-6">
      <section className="card">
        <div className="section-title">
          <h2>Explore marketplace</h2>
          <span className="text-muted">Browse all approved listings and services.</span>
        </div>
        <div className="grid grid-2">
          {sample.map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>
      </section>
    </main>
  )
}
