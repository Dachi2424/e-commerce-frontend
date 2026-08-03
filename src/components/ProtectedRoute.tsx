import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

type Props = {
  requireAdmin?: boolean
}

function ProtectedRoute({ requireAdmin = false }: Props) {
  const { state } = useAuth()
  const location = useLocation()

  // Don't make any redirect decision until the initial session check has
  // resolved — otherwise a logged-in user gets bounced for a flash on
  // every page load, before getUserInfo() has had a chance to run.
  if (!state.authChecked) {
    return <div className="protected-route__loading" />
  }

  if (!state.user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (requireAdmin && state.user.role !== "admin") {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute