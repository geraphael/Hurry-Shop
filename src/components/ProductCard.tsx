import { Link } from 'react-router-dom'

export interface ProductCardProps {
  id: string
  title: string
  price: string
  condition: string
  location: string
  seller: string
  verified?: boolean
  image?: string
}

export function ProductCard({
  id,
  title,
  price,
  condition,
  location,
  seller,
  verified,
  image,
}: ProductCardProps) {
  return (
    <Link to={`/listing/${id}`} className="card product-card">
      <div className="card-image">
        <img src={image ?? 'https://images.unsplash.com/photo-1512499617640-c2f99912a0ab?auto=format&fit=crop&w=900&q=60'} alt={title} />
      </div>
      <div className="product-card-body">
        <h3>{title}</h3>
        <p className="price">{price}</p>
        <p className="text-muted">{condition} • {location}</p>
        <p className="seller-line">
          {seller}
          {verified && <span className="verified-badge">✓ Verified</span>}
        </p>
      </div>
    </Link>
  )
}
