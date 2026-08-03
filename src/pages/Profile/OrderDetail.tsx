import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios, { isAxiosError } from "axios"
import { ArrowLeft, Package } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import "./Orders.scss"

type OrderItem = {
  id: number
  productName: string
  quantity: number
  priceAtPurchase: string
}

type Order = {
  id: number
  totalPrice: string
  status: "paid" | "shipped" | "delivered" | "cancelled"
  createdAt: string
  OrderItems: OrderItem[]
}

function OrderDetail() {
  const { id } = useParams()
  const { refreshToken } = useAuth()
  const navigate = useNavigate()

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOrder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function fetchOrder() {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders/${id}`, { withCredentials: true })
      setOrder(res.data)
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        await refreshToken()
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders/${id}`, { withCredentials: true })
          setOrder(res.data)
        } catch (retryErr) {
          setError(isAxiosError(retryErr) ? retryErr.response?.data?.error || "Failed to load order" : "Failed to load order")
        }
        setLoading(false)
        return
      }
      setError(isAxiosError(err) ? err.response?.data?.error || "Failed to load order" : "Failed to load order")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-section">
      <button type="button" className="profile-section__back" onClick={() => navigate("/profile/orders")}>
        <ArrowLeft size={16} />
        Back to orders
      </button>

      {loading && <p className="profile-status">Loading order…</p>}
      {error && <p className="profile-error">{error}</p>}

      {!loading && order && (
        <>
          <div className="order-detail__header">
            <div>
              <h1 className="profile-section__title">Order #{order.id}</h1>
              <span className="order-detail__date">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <span className={`orders-list__status orders-list__status--${order.status}`}>{order.status}</span>
          </div>

          <div className="profile-card">
            <span className="profile-card__title">Items</span>
            <div className="order-detail__items">
              {order.OrderItems.map((item) => (
                <div key={item.id} className="order-detail__item">
                  <div className="order-detail__item-icon">
                    <Package size={20} />
                  </div>
                  <div className="order-detail__item-info">
                    <span className="order-detail__item-name">{item.productName}</span>
                    <span className="order-detail__item-meta">
                      {item.quantity} × ${item.priceAtPurchase}
                    </span>
                  </div>
                  <span className="order-detail__item-subtotal">
                    ${(Number(item.priceAtPurchase) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="order-detail__total">
              <span>Total</span>
              <span>${order.totalPrice}</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default OrderDetail