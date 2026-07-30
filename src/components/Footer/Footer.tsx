import { Link } from "react-router-dom"
import { CATEGORIES } from "../Header/categories"
import { useAuth } from "../../context/AuthContext"
import "./Footer.scss"

function Footer() {
  const { state: authState } = useAuth()
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <span className="footer__logo-mark">N</span>
            <span className="footer__logo-text">NOVATECH</span>
          </Link>
          <p className="footer__tagline">
            Precision-picked electronics — phones, laptops, and everything in between.
          </p>
        </div>

        <div className="footer__column">
          <span className="footer__column-title">Shop</span>
          <Link to="/products">All products</Link>
          {CATEGORIES.map((cat) => (
            <Link key={cat.value} to={`/products?category=${cat.value}`}>
              {cat.label}
            </Link>
          ))}
        </div>

        <div className="footer__column">
          <span className="footer__column-title">Account</span>
          <Link to={authState.user ? "/profile" : "/login"}>{authState.user ? "Your profile" : "Log in"}</Link>
          <Link to="/checkout">Checkout</Link>
        </div>
      </div>

      <div className="footer__bottom">
        <span>© {year} NOVATECH. All rights reserved.</span>
      </div>
    </footer>
  )
}

export default Footer;