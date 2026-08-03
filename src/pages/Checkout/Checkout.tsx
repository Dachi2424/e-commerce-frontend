import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios, { isAxiosError } from "axios"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { Minus, Plus, Trash2, CheckCircle2 } from "lucide-react"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import CheckoutPaymentForm from "./CheckoutPaymentForm"
import "./Checkout.scss"

// Loaded once at module level, not inside the component — calling
// loadStripe() on every render would reload Stripe.js repeatedly.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

function Checkout() {
  const { state: authState, refreshToken } = useAuth()
  const { state: cartState, changeQuantity, deleteItem, getCart } = useCart()
  const navigate = useNavigate()

  const [creatingIntent, setCreatingIntent] = useState(false)
  const [intentError, setIntentError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentSucceeded, setPaymentSucceeded] = useState(false)

  const validItems = cartState.cart.filter((item) => item.Product)
  const total = validItems.reduce((sum, item) => sum + Number(item.Product.price) * item.quantity, 0)

  function handleQuantityChange(productId: number, quantity: number) {
    if (quantity < 1) return
    changeQuantity({ productId, quantity })
  }

  async function handlePlaceOrder() {
    setIntentError(null)
    setCreatingIntent(true)
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/orders/create-payment-intent`, {}, { withCredentials: true })
      setClientSecret(res.data.clientSecret)
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        await refreshToken()
        try {
          const res = await axios.post(`${import.meta.env.VITE_API_URL}/orders/create-payment-intent`, {}, { withCredentials: true })
          setClientSecret(res.data.clientSecret)
        } catch (retryErr) {
          setIntentError(isAxiosError(retryErr) ? retryErr.response?.data?.error || "Something went wrong" : "Something went wrong")
        }
        setCreatingIntent(false)
        return
      }
      setIntentError(isAxiosError(err) ? err.response?.data?.error || "Something went wrong" : "Something went wrong")
    } finally {
      setCreatingIntent(false)
    }
  }

  function handlePaymentSuccess() {
    setPaymentSucceeded(true)
    // The Stripe webhook creates the Order/OrderItems and clears the cart
    // server-side, asynchronously — this just re-syncs local state once
    // that's had a moment to land, rather than assuming instant timing.
    setTimeout(() => getCart(), 1500)
  }

  if (!authState.user) {
    return (
      <main className="checkout-page">
        <div className="checkout-page__status">
          <p>You need to be logged in to check out.</p>
          <button type="button" onClick={() => navigate("/login", { state: { from: "/checkout" } })}>
            Log in
          </button>
        </div>
      </main>
    )
  }

  if (paymentSucceeded) {
    return (
      <main className="checkout-page">
        <div className="checkout-page__success">
          <CheckCircle2 size={48} strokeWidth={1.5} />
          <h1>Payment successful</h1>
          <p>Your order is being processed and you'll see it in your order history shortly.</p>
          <button type="button" onClick={() => navigate("/products")}>
            Continue shopping
          </button>
        </div>
      </main>
    )
  }

  if (validItems.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-page__status">
          <p>Your cart is empty.</p>
          <button type="button" onClick={() => navigate("/products")}>
            Browse products
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="checkout-page">
      <h1 className="checkout-page__title">Checkout</h1>

      <div className="checkout-page__layout">
        <div className="checkout-page__items">
          {validItems.map((item) => (
            <div key={item.id} className="checkout-page__item">
              <img
                src={item.Product.imageUrl?.[0] || "/placeholder-product.png"}
                alt={item.Product.name}
                className="checkout-page__item-image"
              />

              <div className="checkout-page__item-info">
                <span className="checkout-page__item-name">{item.Product.name}</span>
                <span className="checkout-page__item-price">${item.Product.price}</span>
              </div>

              <div className="checkout-page__qty-stepper">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                  disabled={item.quantity <= 1 || Boolean(clientSecret)}
                  aria-label="Decrease quantity"
                >
                  <Minus size={13} />
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                  disabled={item.quantity >= item.Product.stock || Boolean(clientSecret)}
                  aria-label="Increase quantity"
                >
                  <Plus size={13} />
                </button>
              </div>

              <span className="checkout-page__item-subtotal">
                ${(Number(item.Product.price) * item.quantity).toFixed(2)}
              </span>

              <button
                type="button"
                className="checkout-page__delete-btn"
                onClick={() => deleteItem({ productId: item.productId })}
                disabled={Boolean(clientSecret)}
                aria-label="Remove from cart"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="checkout-page__summary">
          <h2 className="checkout-page__summary-title">Order summary</h2>

          <div className="checkout-page__summary-row">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="checkout-page__summary-row checkout-page__summary-row--total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {!clientSecret ? (
            <>
              {intentError && <p className="checkout-page__error">{intentError}</p>}
              <button
                type="button"
                className="checkout-page__place-order-btn"
                onClick={handlePlaceOrder}
                disabled={creatingIntent}
              >
                {creatingIntent ? "Preparing payment…" : "Proceed to payment"}
              </button>
            </>
          ) : (
            <div className="checkout-page__payment-form-wrap">
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "stripe",
                    variables: {
                      colorPrimary: "#154C79",
                      colorBackground: "#FAFBFF",
                      colorText: "#16213A",
                      colorDanger: "#E0522F",
                      borderRadius: "8px",
                      fontFamily: "Inter, sans-serif",
                    },
                  },
                }}
              >
                <CheckoutPaymentForm onSuccess={handlePaymentSuccess} />
              </Elements>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default Checkout