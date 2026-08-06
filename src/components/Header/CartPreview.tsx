import { useState, useEffect, useRef, useReducer } from "react"
import { useNavigate } from "react-router-dom"
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "../../context/CartContext"

type Props = {
  count: number
  mobile?: boolean
  onNavigate?: () => void
}

function CartPreview({ count, mobile = false, onNavigate }: Props) {
  const [hovering, setHovering] = useState(false)
  const [bump, setBump] = useState(false)
  const [panelClosing, setPanelClosing] = useState(false)
  const prevCountRef = useRef(count)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { state, changeQuantity, deleteItem } = useCart()
  const navigate = useNavigate()




  useEffect(() => {
    if (count > prevCountRef.current) {
      setBump(true)
      const timeoutId = setTimeout(() => setBump(false), 400)
      prevCountRef.current = count
      return () => clearTimeout(timeoutId)
    }
    prevCountRef.current = count
  }, [count])

  // Cancel any pending close timeout if the component unmounts mid-close.
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  function handleQuantityChange(productId: number, quantity: number) {
    if (quantity < 1) return
    changeQuantity({ productId, quantity })
  }

  function handleDelete(productId: number) {
    deleteItem({ productId })
  }

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

  function openPanel(){
    // Cancel any pending close from a moment ago — otherwise it fires
    // later and closes a panel the user has already re-opened.
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setPanelClosing(false)
    setHovering(true)
  }

  function closePanel(){
    setPanelClosing(true)
    closeTimeoutRef.current = setTimeout(() => {
      setHovering(false)
      closeTimeoutRef.current = null
    }, 400)
  }

  const total = state.cart.reduce(
    (sum, item) => (item.Product ? sum + Number(item.Product.price) * item.quantity : sum),
    0
  )

  if (mobile) {
    return (
      <button type="button" className="mobile-drawer__cart-bar" onClick={goToCheckout}>
        <span className="mobile-drawer__cart-bar-icon">
          <ShoppingCart size={20} />
          {count > 0 && (
            <span className={`cart-preview__badge ${bump ? "cart-preview__badge--bump" : ""}`}>{count}</span>
          )}
        </span>
        <span className="mobile-drawer__cart-bar-label">
          {count === 0 ? "View cart" : `View cart · ${count} item${count > 1 ? "s" : ""}`}
        </span>
        {total > 0 && <span className="mobile-drawer__cart-bar-total">${total.toFixed(2)}</span>}
      </button>
    )
  }

  return (
    <div className="cart-preview"  onMouseLeave={() => closePanel()}>
      <button type="button" className="cart-preview__trigger" onClick={goToCheckout} onMouseEnter={() => openPanel()} aria-label="Go to checkout">
        <ShoppingCart size={24} color="white" strokeWidth={1.8}/>
        {count > 0 && (
          <span className={`cart-preview__badge ${bump ? "cart-preview__badge--bump" : ""}`}>{count}</span>
        )}
      </button>

      {hovering && (
        <div className={`cart-preview__panel ${panelClosing ? "cart-preview__panel--closing" : ""}`}>
          <div className="cart-preview__cart-text-container">
            <span className="cart-preview__cart-text">Cart</span>
            <span className="cart-preview__product-count">{count} {count > 1 ? "products" : "product"}</span>
          </div>
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
                  <div key={item.id} className="cart-preview__item">
                    <img
                      src={item.Product?.imageUrl?.[0] || "/placeholder-product.png"}
                      alt={item.Product?.name || "Product"}
                      className="cart-preview__item-image"
                      onClick={() => goToProduct(item.productId)}
                    />
                    <div className="cart-preview__item-info">
                      <span className="cart-preview__item-name" onClick={() => goToProduct(item.productId)}>
                        {item.Product?.name || "Unknown product"}
                      </span>
                      <span className="cart-preview__item-price">
                        {item.Product ? `$${item.Product.price}` : "—"}
                      </span>

                      <div className="cart-preview__item-controls">
                        <div className="cart-preview__qty-stepper">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={11} color="white" strokeWidth={3} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            disabled={item.Product ? item.quantity >= item.Product.stock : false}
                            aria-label="Increase quantity"
                          >
                            <Plus size={11} color="white" strokeWidth={3} />
                          </button>
                        </div>

                        <button
                          type="button"
                          className="cart-preview__delete-btn"
                          onClick={() => handleDelete(item.productId)}
                          aria-label="Remove from cart"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-preview__total-to-pay">
                <span className="cart-preview__total-text">Total amount to pay</span>
                <span className="cart-preview__total-money">3000$</span>
              </div>
              <button type="button" className="cart-preview__checkout-btn" onClick={goToCheckout}>Go to checkout</button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default CartPreview