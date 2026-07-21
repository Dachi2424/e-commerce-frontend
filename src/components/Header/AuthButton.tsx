import { Link, useLocation } from "react-router-dom"
import { LogIn, User, ChevronRight } from "lucide-react"

type Props = {
  isAuthenticated: boolean
  mobile?: boolean
  onNavigate?: () => void
}

function AuthButton({ isAuthenticated, mobile = false, onNavigate }: Props) {
  const location = useLocation()
  // Remember where the user was, so Login can send them back after success.
  const loginState = { from: location.pathname + location.search }

  if (mobile) {
    return (
      <Link
        to={isAuthenticated ? "/profile" : "/auth"}
        state={isAuthenticated ? undefined : loginState}
        className="mobile-drawer__row"
        onClick={onNavigate}
      >
        {isAuthenticated ? <User size={19} /> : <LogIn size={19} />}
        <span>{isAuthenticated ? "Your profile" : "Log in"}</span>
        <ChevronRight size={16} className="mobile-drawer__row-chevron" />
      </Link>
    )
  }

  if (isAuthenticated) {
    return (
      <Link to="/profile" className="auth-button" onClick={onNavigate} aria-label="Your profile">
        <User size={22} />
      </Link>
    )
  }

  return (
    <Link to="/auth" state={loginState} className="auth-button" onClick={onNavigate} aria-label="Log in">
      <LogIn size={22} />
    </Link>
  )
}

export default AuthButton