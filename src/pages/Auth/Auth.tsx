import { useState, useEffect, type FormEvent } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./Auth.scss"

type Mode = "login" | "signup"

function Auth() {
  const [mode, setMode] = useState<Mode>("login")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [formError, setFormError] = useState<string | null>(null)

  const { state, login, signup } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const redirectTo = (location.state as { from?: string } | null)?.from || "/"

  // Covers two cases: user just logged in successfully, or they were
  // already authenticated and landed on this page directly (e.g. typed
  // /login in the URL bar) — either way, send them where they need to be.
  useEffect(() => {
    if (state.user) {
      navigate(redirectTo, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.user])

  function switchMode(next: Mode) {
    setUsername("")
    setEmail("")
    setPassword("")
    setMode(next)
    setFormError(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)

    if (mode === "signup" && !username.trim()) {
      setFormError("Username is required")
      return
    }
    if (!email.trim() || !password) {
      setFormError("All fields are required")
      return
    }
    if (password.length < 8 || password.length > 30) {
      setFormError("Password must be between 8 and 30 characters")
      return
    }

    if (mode === "login") {
      await login({ email, password })
    } else {
      await signup({ username: username.trim(), email: email.trim(), password })
    }
  }

  const displayError = formError || state.error

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-card__tabs">
          <button
            type="button"
            className={`auth-card__tab ${mode === "login" ? "auth-card__tab--active" : ""}`}
            onClick={() => switchMode("login")}
          >
            Log in
          </button>
          <button
            type="button"
            className={`auth-card__tab ${mode === "signup" ? "auth-card__tab--active" : ""}`}
            onClick={() => switchMode("signup")}
          >
            Sign up
          </button>
        </div>

        <form className="auth-card__form" onSubmit={handleSubmit} noValidate>
          {mode === "signup" && (
            <label className="auth-card__field">
              <span>Username</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yourusername"
                autoComplete="username"
              />
            </label>
          )}

          <label className="auth-card__field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label className="auth-card__field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </label>

          {displayError && <p className="auth-card__error">{displayError}</p>}

          <button type="submit" className="auth-card__submit" disabled={state.loading}>
            {state.loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>

        <p className="auth-card__switch">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button type="button" onClick={() => switchMode("signup")}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" onClick={() => switchMode("login")}>
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </main>
  )
}

export default Auth