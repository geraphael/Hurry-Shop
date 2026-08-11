import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabaseClient'

function activeClass({ isActive }: { isActive: boolean }) {
  return isActive ? 'nav-link active' : 'nav-link'
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth()

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="app-shell">
      <div className="container">
        <header className="header card">
          <div>
            <Link to="/" className="brand">
              <strong>Hury Shop</strong>
            </Link>
            <p className="tagline">Buy. Sell. Connect.</p>
          </div>
          <nav className="nav-links">
            <NavLink to="/" className={activeClass}>
              Home
            </NavLink>
            <NavLink to="/explore" className={activeClass}>
              Explore
            </NavLink>
            <NavLink to="/sell" className={activeClass}>
              Sell
            </NavLink>
            {user && (
              <>
                <NavLink to="/offers" className={activeClass}>
                  Offers
                </NavLink>
                <NavLink to="/messages" className={activeClass}>
                  Messages
                </NavLink>
                <NavLink to={`/profile/${profile?.id ?? 'me'}`} className={activeClass}>
                  Profile
                </NavLink>
              </>
            )}
            {profile?.role === 'admin' && (
              <NavLink to="/admin" className={activeClass}>
                Admin
              </NavLink>
            )}
          </nav>
          <div className="header-actions">
            {user ? (
              <button type="button" className="secondary" onClick={signOut}>
                Logout
              </button>
            ) : (
              <div className="button-group">
                <Link to="/login" className="secondary">
                  Login
                </Link>
                <Link to="/register" className="primary">
                  Register
                </Link>
              </div>
            )}
          </div>
        </header>
        {children}
      </div>
    </div>
  )
}
