import { useState, useEffect, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

function PersonalInfo() {
  const { state, changeData } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState(state.user?.username || "")
  const [email, setEmail] = useState(state.user?.email || "")
  const [phone, setPhone] = useState(state.user?.phone || "")
  const [idNumber, setIdNumber] = useState(state.user?.idNumber || "")
  const [saved, setSaved] = useState(false)

  // Keep the form in sync if the user object changes elsewhere (e.g.
  // after this same save completes and context updates).
  useEffect(() => {
    if (!state.user) return
    setUsername(state.user.username)
    setEmail(state.user.email)
    setPhone(state.user.phone || "")
    setIdNumber(state.user.idNumber || "")
  }, [state.user])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaved(false)
    await changeData({ username, email, phone, idNumber })
    setSaved(true)
  }

  return (
    <div className="profile-section">
      <button type="button" className="profile-section__back" onClick={() => navigate("/profile")}>
        <ArrowLeft size={16} />
        Back
      </button>

      <h1 className="profile-section__title">Personal info</h1>

      <form className="profile-card" onSubmit={handleSubmit}>
        <div className="profile-grid">
          <label className="profile-field">
            <span>Username</span>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>

          <label className="profile-field">
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <label className="profile-field">
            <span>Phone (9 digits)</span>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 555123456"
            />
          </label>

          <label className="profile-field">
            <span>ID number (11 digits)</span>
            <input type="text" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
          </label>
        </div>

        {saved && !state.error && <p className="profile-success">Changes saved.</p>}
        {state.error && <p className="profile-error">{state.error}</p>}

        <button type="submit" className="profile-btn" disabled={state.loading}>
          {state.loading ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  )
}

export default PersonalInfo