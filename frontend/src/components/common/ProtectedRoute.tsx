import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-navy-900">
        <span className="w-8 h-8 rounded-full border-2 border-navy-600 border-t-blue-primary animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return <>{children}</>
}
