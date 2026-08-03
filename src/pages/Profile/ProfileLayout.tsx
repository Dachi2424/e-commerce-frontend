import { Outlet, useLocation } from "react-router-dom"
import ProfileMenu from "./ProfileMenu"
import "./Profile.scss"

function ProfileLayout() {
  const location = useLocation()
  const isIndex = location.pathname === "/profile" || location.pathname === "/profile/"

  return (
    <main className="profile-page">
      <div className={`profile-page__layout ${!isIndex ? "profile-page__layout--section-active" : ""}`}>
        <ProfileMenu />
        <div className="profile-page__content">
          {isIndex ? (
            <div className="profile-page__placeholder">
              <p>Select a section to get started.</p>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </main>
  )
}

export default ProfileLayout