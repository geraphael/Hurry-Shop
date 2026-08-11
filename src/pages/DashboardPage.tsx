export function DashboardPage() {
  const stats = [
    { label: 'Users', value: '420' },
    { label: 'Verified Sellers', value: '87' },
    { label: 'Pending Sellers', value: '6' },
    { label: 'Active Listings', value: '183' },
    { label: 'Pending Listings', value: '12' },
    { label: 'Reports', value: '3' },
  ]

  return (
    <main className="mt-6">
      <section className="card">
        <div className="section-title">
          <h2>HURY SHOP ADMIN</h2>
          <span className="text-muted">Administrator dashboard and review center.</span>
        </div>
        <div className="grid grid-3 mt-6">
          {stats.map((stat) => (
            <div key={stat.label} className="card">
              <p className="text-muted">{stat.label}</p>
              <h3>{stat.value}</h3>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
