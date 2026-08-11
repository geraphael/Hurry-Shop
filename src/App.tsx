import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ExplorePage } from './pages/ExplorePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ListingDetailsPage } from './pages/ListingDetailsPage'
import { ProfilePage } from './pages/ProfilePage'
import { SubmitListingPage } from './pages/SubmitListingPage'
import { DashboardPage } from './pages/DashboardPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { Layout } from './components/Layout'
import { useAuth } from './lib/auth'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="app-shell">
        <div className="spinner">Loading…</div>
      </div>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
        <Route path="/listing/:id" element={<ListingDetailsPage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/sell" element={user ? <SubmitListingPage /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user?.app_metadata?.role === 'admin' ? <DashboardPage /> : <Navigate to="/" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}
