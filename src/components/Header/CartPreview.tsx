import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ShoppingCart } from "lucide-react"
import { useCart } from "../../context/CartContext"

type Props = {
  count: number
  mobile?: boolean
  onNavigate?: () => void
}

function CartPreview({ count, mobile = false, onNavigate }: Props) {
  const [hovering, setHovering] = useState(false)
  const { state } = useCart()
  const navigate = useNavigate()

  function goToCheckout() {
    navigate("/checkout")
    onNavigate?.()
  }

  function goToProducts() {
    navigate("/products")
    onNavigate?.()
  }

  function goToProduct(id: number) {
    navigate(`/products/${id}`)
    onNavigate?.()
  }

  if (mobile) {
    const total = state.cart.reduce(
      (sum, item) => sum + Number(item.Products.price) * item.quantity,
      0
    )

    return (
      <button type="button" className="mobile-drawer__cart-bar" onClick={goToCheckout}>
        <span className="mobile-drawer__cart-bar-icon">
          <ShoppingCart size={20} />
          {count > 0 && <span className="cart-preview__badge">{count}</span>}
        </span>
        <span className="mobile-drawer__cart-bar-label">
          {count === 0 ? "View cart" : `View cart · ${count} item${count > 1 ? "s" : ""}`}
        </span>
        {total > 0 && <span className="mobile-drawer__cart-bar-total">${total.toFixed(2)}</span>}
      </button>
    )
  }

  return (
    <div
      className="cart-preview"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <button type="button" className="cart-preview__trigger" onClick={goToCheckout} aria-label="Go to checkout">
        <ShoppingCart size={22} />
        {count > 0 && <span className="cart-preview__badge">{count}</span>}
      </button>

      {hovering && (
        <div className="cart-preview__panel">
          {state.cart.length === 0 ? (
            <div className="cart-preview__empty">
              {/* Swap this for your own illustration once it's in /assets */}
              <div className="cart-preview__empty-image" aria-hidden="true">
                <ShoppingCart size={32} strokeWidth={1.25} />
              </div>
              <p className="cart-preview__empty-text">Your cart is empty</p>
              <button type="button" className="cart-preview__browse-btn" onClick={goToProducts}>
                Browse products
              </button>
            </div>
          ) : (
            <>
              <div className="cart-preview__list">
                {state.cart.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="cart-preview__item"
                    onClick={() => goToProduct(item.productId)}
                  >
                    <img
                      src={item.Products.imageUrl?.[0] || "/placeholder-product.png"}
                      alt={item.Products.name}
                      className="cart-preview__item-image"
                    />
                    <div className="cart-preview__item-info">
                      <span className="cart-preview__item-name">{item.Products.name}</span>
                      <span className="cart-preview__item-meta">
                        {item.quantity} × ${item.Products.price}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <button type="button" className="cart-preview__checkout-btn" onClick={goToCheckout}>
                Go to checkout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default CartPreview