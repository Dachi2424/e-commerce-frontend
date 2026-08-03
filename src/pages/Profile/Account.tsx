import { useState, useEffect, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

function Account() {
  const { state, changePassword, logout, logoutAll, deleteAccount } = useAuth()
  const navigate = useNavigate()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordFormError, setPasswordFormError] = useState<string | null>(null)
  const [passwordChanged, setPasswordChanged] = useState(false)

  const [confirmingDelete, setConfirmingDelete] = useState(false)

  // changePassword (and delete/logout) clear the session server-side —
  // once state.user flips to null because of one of THESE actions
  // specifically (not just on initial mount), send them to login.
  useEffect(() => {
    if (passwordChanged && !state.user) {
      navigate("/login")
    }
  }, [passwordChanged, state.user, navigate])

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault()
    setPasswordFormError(null)

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordFormError("All fields are required")
      return
    }
    if (newPassword.length < 8 || newPassword.length > 30) {
      setPasswordFormError("New password must be between 8 and 30 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordFormError("New passwords don't match")
      return
    }

    await changePassword({ currentPassword, newPassword })
    setPasswordChanged(true)
  }

  async function handleLogout() {
    await logout()
    navigate("/")
  }

  async function handleLogoutAll() {
    await logoutAll()
    navigate("/")
  }

  async function handleDeleteAccount() {
    await deleteAccount()
    navigate("/")
  }

  const passwordError = passwordFormError || (!passwordChanged ? state.error : null)

  return (
    <div className="profile-section">
      <button type="button" className="profile-section__back" onClick={() => navigate("/profile")}>
        <ArrowLeft size={16} />
        Back
      </button>

      <h1 className="profile-section__title">Account</h1>

      <form className="profile-card" onSubmit={handleChangePassword}>
        <span className="profile-card__title">Change password</span>

        <label className="profile-field">
          <span>Current password</span>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        </label>

        <div className="profile-grid">
          <label className="profile-field">
            <span>New password</span>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </label>
          <label className="profile-field">
            <span>Confirm new password</span>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </label>
        </div>

        {passwordError && <p className="profile-error">{passwordError}</p>}

        <button type="submit" className="profile-btn" disabled={state.loading}>
          {state.loading ? "Updating…" : "Update password"}
        </button>
      </form>

      <div className="profile-card">
        <span className="profile-card__title">Sessions</span>
        <p className="profile-card__description">Log out of this device, or every device you're currently signed into.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" className="profile-btn profile-btn--outline" onClick={handleLogout}>
            Log out
          </button>
          <button type="button" className="profile-btn profile-btn--outline" onClick={handleLogoutAll}>
            Log out of all devices
          </button>
        </div>
      </div>

      <div className="profile-card">
        <span className="profile-card__title">Delete account</span>
        <p className="profile-card__description">
          This permanently deletes your account, cart, and order history. This can't be undone.
        </p>

        {!confirmingDelete ? (
          <button
            type="button"
            className="profile-btn profile-btn--danger"
            onClick={() => setConfirmingDelete(true)}
          >
            Delete my account
          </button>
        ) : (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <span className="profile-error" style={{ flex: "1 1 100%" }}>
              Are you sure? This can't be undone.
            </span>
            <button type="button" className="profile-btn profile-btn--danger" onClick={handleDeleteAccount}>
              Yes, delete permanently
            </button>
            <button type="button" className="profile-btn profile-btn--outline" onClick={() => setConfirmingDelete(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Account