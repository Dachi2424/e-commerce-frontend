import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios, { isAxiosError } from "axios"
import { ArrowLeft, ChevronRight } from "lucide-react"
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

function Orders() {
  const { refreshToken } = useAuth()
  const navigate = useNavigate()

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchOrders() {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders`, { withCredentials: true })
      setOrders(res.data)
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        await refreshToken()
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders`, { withCredentials: true })
          setOrders(res.data)
        } catch (retryErr) {
          setError(isAxiosError(retryErr) ? retryErr.response?.data?.error || "Failed to load orders" : "Failed to load orders")
        }
        setLoading(false)
        return
      }
      setError(isAxiosError(err) ? err.response?.data?.error || "Failed to load orders" : "Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-section">
      <button type="button" className="profile-section__back" onClick={() => navigate("/profile")}>
        <ArrowLeft size={16} />
        Back
      </button>

      <h1 className="profile-section__title">Orders</h1>

      {loading && <p className="profile-status">Loading orders…</p>}
      {error && <p className="profile-error">{error}</p>}

      {!loading && !error && orders.length === 0 && <p className="profile-status">You haven't placed any orders yet.</p>}

      {!loading && orders.length > 0 && (
        <div className="orders-list">
          {orders.map((order) => (
            <button
              key={order.id}
              type="button"
              className="orders-list__item"
              onClick={() => navigate(`/profile/orders/${order.id}`)}
            >
              <div className="orders-list__item-main">
                <span className="orders-list__item-id">Order #{order.id}</span>
                <span className="orders-list__item-date">
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <span className={`orders-list__status orders-list__status--${order.status}`}>{order.status}</span>

              <span className="orders-list__item-count">
                {order.OrderItems?.length || 0} item{(order.OrderItems?.length || 0) === 1 ? "" : "s"}
              </span>

              <span className="orders-list__item-total">${order.totalPrice}</span>

              <ChevronRight size={18} className="orders-list__item-chevron" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders