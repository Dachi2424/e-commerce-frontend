import { NavLink } from "react-router-dom"
import { User, ShieldCheck, Package, ChevronRight } from "lucide-react"

const MENU_ITEMS = [
  { to: "/profile/personal-info", label: "Personal info", icon: User },
  { to: "/profile/account", label: "Account", icon: ShieldCheck },
  { to: "/profile/orders", label: "Orders", icon: Package },
]

function ProfileMenu() {
  return (
    <nav className="profile-menu">
      {MENU_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `profile-menu__item ${isActive ? "profile-menu__item--active" : ""}`}
        >
          <Icon size={19} />
          <span>{label}</span>
          <ChevronRight size={16} className="profile-menu__item-chevron" />
        </NavLink>
      ))}
    </nav>
  )
}

export default ProfileMenu