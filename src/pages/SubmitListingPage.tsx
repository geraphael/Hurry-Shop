import { useState } from 'react'

const categories = [
  'Electronics',
  'Phones & Tablets',
  'Computers',
  'Fashion',
  'Shoes',
  'Books',
  'Furniture',
  'Home Items',
  'Food',
  'Beauty',
  'Sports',
  'School Supplies',
  'Services',
  'Other',
]

export function SubmitListingPage() {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [condition, setCondition] = useState('Good')
  const [description, setDescription] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    alert('Listing submitted for review.')
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
            Price
            <input value={price} onChange={(event) => setPrice(event.target.value)} required />
          </label>
          <label>
            Category
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label>
            Condition
            <select value={condition} onChange={(event) => setCondition(event.target.value)}>
              <option>New</option>
              <option>Like New</option>
              <option>Good</option>
              <option>Fair</option>
              <option>Used</option>
            </select>
          </label>
          <label>
            Description
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={5} required />
          </label>
          <button type="submit" className="primary">
            Submit for review
          </button>
        </form>
      </section>
    </main>
  )
}
