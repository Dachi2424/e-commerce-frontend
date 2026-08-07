import { Link, useNavigate, useLocation } from "react-router-dom"
import type { MouseEvent } from "react"
import { ShoppingCart } from "lucide-react"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import "./ProductGrid.scss"

type Product = {
  id: number
  name: string
  price: string
  stock: number
  category: string
  imageUrl: string[]
}

type Props = {
  products: Product[]
  loading: boolean
  error: string | null
}

function ProductGrid({ products, loading, error }: Props) {
  const { addToCart } = useCart()
  const { state: authState } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function requireAuth(): boolean {
    if (!authState.user) {
      navigate("/login", { state: { from: location.pathname + location.search } })
      return false
    }
    return true
  }

  function handleAddToCart(e: MouseEvent, productId: number) {
    e.preventDefault()
    e.stopPropagation()
    if (!requireAuth()) return;
    addToCart({ productId, quantity: 1})
  }

  async function handleBuyNow(e: MouseEvent, productId: number) {
    e.preventDefault()
    e.stopPropagation()
    if (!requireAuth()) return
    await addToCart({ productId, quantity: 1 })
    navigate("/checkout")
  }

  if (loading) {
    return <p className="product-grid__status">Loading products…</p>
  }

  if (error) {
    return <p className="product-grid__error">{error}</p>
  }

  if (products.length === 0) {
    return <p className="product-grid__status">No products match these filters.</p>
  }

  return (
    <div className="product-grid">
      {products.map((product) => {
        const outOfStock = product.stock === 0
        return (
          <Link key={product.id} to={`/products/${product.id}`} className="product-grid__card">
            <img
              src={product.imageUrl?.[0] || "/placeholder-product.png"}
              alt={product.name}
              className="product-grid__card-image"
            />
            <div className="product-grid__card-info">
              
              <span className="product-grid__card-name">{product.name}</span>
              <span className="product-grid__card-price">${product.price}</span>
              {outOfStock && <span className="product-grid__card-out-of-stock">Out of stock</span>}
            </div>

            <div className="product-grid__card-actions">
              <button
                type="button"
                className="product-grid__cart-btn"
                onClick={(e) => handleAddToCart(e, product.id)}
                disabled={outOfStock}
                aria-label="Add to cart"
              >
                <ShoppingCart size={17} />
              </button>
              <button
                type="button"
                className="product-grid__buy-btn"
                onClick={(e) => handleBuyNow(e, product.id)}
                disabled={outOfStock}
              >
                Buy
              </button>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default ProductGrid