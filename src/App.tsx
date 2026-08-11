import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ExplorePage } from './pages/ExplorePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ListingDetailsPage } from './pages/ListingDetailsPage'
import { ProfilePage } from './pages/ProfilePage'
import { SubmitListingPage } from './pages/SubmitListingPage'
import { DashboardPage } from './pages/DashboardPage'
import { MessagesPage } from './pages/MessagesPage'
import { OffersPage } from './pages/OffersPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { Layout } from './components/Layout'
import { useAuth } from './lib/auth'

export default function App() {
  const { user, profile, loading } = useAuth()

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
        <Route path="/messages" element={user ? <MessagesPage /> : <Navigate to="/login" />} />
        <Route path="/offers" element={user ? <OffersPage /> : <Navigate to="/login" />} />
        <Route path="/admin" element={profile?.role === 'admin' ? <DashboardPage /> : <Navigate to="/" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}
