import { useState, type FormEvent } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"

type Props = {
  onSuccess: () => void
}

function CheckoutPaymentForm({ onSuccess }: Props) {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    setSubmitting(true)
    setError(null)

    // redirect: "if_required" keeps the customer on this page for the
    // common case — Stripe only redirects away if the specific payment
    // method genuinely requires it (e.g. certain bank redirect methods).
    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    })

    if (confirmError) {
      setError(confirmError.message || "Payment failed. Please check your details and try again.")
      setSubmitting(false)
      return
    }

    if (paymentIntent?.status === "succeeded") {
      onSuccess()
    } else {
      setError("Payment did not complete. Please try again.")
      setSubmitting(false)
    }
  }

  return (
    <form className="checkout-payment-form" onSubmit={handleSubmit}>
      <PaymentElement />

      {error && <p className="checkout-page__error">{error}</p>}

      <button type="submit" className="checkout-page__place-order-btn" disabled={!stripe || submitting}>
        {submitting ? "Processing…" : "Pay now"}
      </button>
    </form>
  )
}

export default CheckoutPaymentForm