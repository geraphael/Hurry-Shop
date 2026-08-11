import React from 'react'

type ErrorBoundaryState = {
  error: Error | null
}

type ErrorBoundaryProps = {
  children: React.ReactNode
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App error boundary caught:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="app-shell">
          <div className="error-screen">
            <h1>Application failed to load</h1>
            <p>{this.state.error.message}</p>
            <p>
              Check your Vercel environment variables:<br />
              <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
