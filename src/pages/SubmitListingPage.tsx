import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { fetchCategories, submitListing, uploadListingImage, createSellerRequest } from '../lib/db'
import type { Category } from '../types'

const conditions = ['New', 'Like New', 'Good', 'Fair', 'Used']
const listingTypes = ['FIXED_PRICE', 'NEGOTIABLE', 'BIDDING']

export function SubmitListingPage() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [condition, setCondition] = useState('Good')
  const [listingType, setListingType] = useState('FIXED_PRICE')
  const [campusLocation, setCampusLocation] = useState(profile?.campus ?? '')
  const [description, setDescription] = useState('')
  const [cover, setCover] = useState<File | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  })

  const listingMutation = useMutation({
    mutationFn: submitListing,
    onSuccess: () => {
      navigate('/')
    },
    onError: (error: any) => {
      setError(error.message ?? 'Unable to submit listing.')
    },
  })

  const sellerRequestMutation = useMutation({
    mutationFn: createSellerRequest,
    onSuccess: () => {
      window.alert('Seller verification request submitted successfully.')
    },
    onError: (error: any) => {
      setError(error.message ?? 'Unable to request seller verification.')
    },
  })

  const handleImageUpload = async (file: File) => {
    setError(null)
    try {
      const url = await uploadListingImage(file)
      setPhotoUrl(url)
    } catch (uploadError: any) {
      setError(uploadError.message ?? 'Image upload failed.')
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!profile) {
      setError('You must be logged in to submit a listing.')
      return
    }

    if (!categoryId) {
      setError('Please choose a category.')
      return
    }

    await listingMutation.mutateAsync({
      title,
      description,
      price: Number(price),
      category_id: categoryId,
      condition,
      campus_location: campusLocation,
      listing_type: listingType,
      cover_url: photoUrl ?? undefined,
      image_urls: photoUrl ? [photoUrl] : undefined,
      seller_id: profile.id,
    })
  }

  return (
    <main className="mt-6">
      <section className="card max-w-2xl mx-auto">
        <div className="section-title">
          <h2>Submit listing</h2>
          <span className="text-muted">Create a product or service listing for admin review.</span>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4 mt-6">
          <label>
            Title
            <input value={title} onChange={(event) => setTitle(event.target.value)} required />
          </label>
          <label>
            Price (KSh)
            <input type="number" value={price} onChange={(event) => setPrice(event.target.value)} required />
          </label>
          <label>
            Category
            <select value={categoryId ?? ''} onChange={(event) => setCategoryId(Number(event.target.value))} required>
              <option value="">Choose a category</option>
              {categories?.map((item: Category) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-2 gap-4">
            <label>
              Condition
              <select value={condition} onChange={(event) => setCondition(event.target.value)}>
                {conditions.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Listing type
              <select value={listingType} onChange={(event) => setListingType(event.target.value)}>
                {listingTypes.map((value) => (
                  <option key={value} value={value}>
                    {value.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Campus location
            <input value={campusLocation} onChange={(event) => setCampusLocation(event.target.value)} required />
          </label>
          <label>
            Description
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={5} required />
          </label>
          <label>
            Cover image
            <input
              type="file"
              accept="image/*"
              onChange={(event) => event.target.files?.[0] && handleImageUpload(event.target.files[0])}
            />
          </label>
          {photoUrl && (
            <div className="card-image">
              <img src={photoUrl} alt="Uploaded listing" />
            </div>
          )}
          {error && <p className="text-error">{error}</p>}
          <button type="submit" className="primary">
            Submit for review
          </button>
          {profile?.verification_status === 'NOT_VERIFIED' && (
            <button type="button" className="secondary" onClick={() => sellerRequestMutation.mutate(profile.id)}>
              Request seller verification
            </button>
          )}
        </form>
      </section>
    </main>
  )
}
