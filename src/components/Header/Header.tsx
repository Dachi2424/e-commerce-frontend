import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Menu, X, Search } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { useCart } from "../../context/CartContext"
import CategoryDropdown from "./CategoryDropdown"
import SearchBar from "./SearchBar"
import MobileSearchSheet from "./MobileSearchSheet"
import CartPreview from "./CartPreview"
import LanguageSwitcher from "./LanguageSwitcher"
import AuthButton from "./AuthButton"
import "./Header.scss"

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const { state: authState } = useAuth()
  const { state: cartState } = useCart()

  const cartCount = cartState.cart.reduce((sum, item) => sum + item.quantity, 0)

  // Lock page scroll while the mobile drawer or search sheet is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen || mobileSearchOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen, mobileSearchOpen])

  function closeMobileMenu() {
    setMobileMenuOpen(false)
  }

  function openMobileSearch() {
    setMobileMenuOpen(false)
    setMobileSearchOpen(true)
  }

  function toggleMobileMenu() {
    setMobileSearchOpen(false)
    setMobileMenuOpen((v) => !v)
  }

  return (
    <header className="header">
      <div className="header__bar">
        <Link to="/" className="header__logo" onClick={closeMobileMenu}>
          {/* Placeholder wordmark — swap once the name is decided */}
          <span className="header__logo-mark">N</span>
          <span className="header__logo-text">NOVATECH</span>
        </Link>

        <nav className="header__nav header__nav--desktop">
          <CategoryDropdown />
          <SearchBar />
        </nav>

        <div className="header__actions">
          <div className="header__actions-desktop">
            <CartPreview count={cartCount} />
            <AuthButton isAuthenticated={!!authState.user} />
            <LanguageSwitcher />
          </div>

          <button
            type="button"
            className="header__search-trigger"
            aria-label="Search"
            onClick={openMobileSearch}
          >
            <Search size={22} />
          </button>

          <button
            type="button"
            className="header__burger"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className={`mobile-drawer ${mobileMenuOpen ? "mobile-drawer--open" : ""}`}>
        <div className="mobile-drawer__header">
          <span className="mobile-drawer__title">Menu</span>
          <button
            type="button"
            className="mobile-drawer__close"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <div className="mobile-drawer__body">
          <CategoryDropdown mobile onNavigate={closeMobileMenu} />

          <div className="mobile-drawer__divider" />

          <AuthButton isAuthenticated={!!authState.user} mobile onNavigate={closeMobileMenu} />

          <div className="mobile-drawer__divider" />

          <LanguageSwitcher mobile />
        </div>

        <div className="mobile-drawer__footer">
          <CartPreview count={cartCount} mobile onNavigate={closeMobileMenu} />
        </div>
      </div>

      {mobileMenuOpen && <div className="header__backdrop" onClick={closeMobileMenu} />}

      <MobileSearchSheet open={mobileSearchOpen} onClose={() => setMobileSearchOpen(false)} />
    </header>
  )
}

export default Header