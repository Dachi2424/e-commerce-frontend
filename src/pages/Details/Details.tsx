import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import axios, { isAxiosError } from "axios"
import { ShoppingCart } from "lucide-react"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import ImageSlider from "../../components/ImageSlider/ImageSlider"
import DetailSpecs, { formatValue } from "./DetailSpecs"
import { CATEGORY_SPEC_SCHEMAS } from "../ProductForm/specSchemas"
import "./Details.scss"

type Product = {
  id: number
  name: string
  description: string | null
  price: string
  stock: number
  category: string
  imageUrl: string[]
  specifications: Record<string, Record<string, unknown>>
}

function Details() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { addToCart } = useCart()
  const { state: authState } = useAuth()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [sliderOpen, setSliderOpen] = useState(false)

  useEffect(() => {
    fetchProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function fetchProduct() {
    setLoading(true)
    setError(null)
    setActiveImage(0)
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`)
      setProduct(res.data)
    } catch (err) {
      setError(isAxiosError(err) ? err.response?.data?.error || "Failed to load product" : "Failed to load product")
    } finally {
      setLoading(false)
    }
  }

  function requireAuth(): boolean {
    if (!authState.user) {
      navigate("/login", { state: { from: location.pathname } })
      return false
    }
    return true
  }

  function handleAddToCart() {
    if (!product || !requireAuth()) return
    addToCart({ productId: product.id, quantity: 1 })
  }

  async function handleBuyNow() {
    if (!product || !requireAuth()) return
    await addToCart({ productId: product.id, quantity: 1 })
    navigate("/checkout")
  }

  if (loading) {
    return (
      <main className="details-page">
        <p className="details-page__status">Loading…</p>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="details-page">
        <p className="details-page__error">{error || "Product not found"}</p>
      </main>
    )
  }

  const images = product.imageUrl && product.imageUrl.length > 0 ? product.imageUrl : ["/placeholder-product.png"]
  const outOfStock = product.stock === 0

  const schema = CATEGORY_SPEC_SCHEMAS[product.category] || []
  const generalFields = schema.filter((f) => f.group === "general")
  const generalHighlights = generalFields
    .map((field) => ({ label: field.label, display: formatValue(field, product.specifications?.general?.[field.key]) }))
    .filter((row): row is { label: string; display: string } => row.display !== null)

  return (
    <main className="details-page">
      <div className="details-page__top">
        <div className="details-page__gallery">
          <button type="button" className="details-page__main-image" onClick={() => setSliderOpen(true)}>
            <img src={images[activeImage]} alt={product.name} />
          </button>

          {images.length > 1 && (
            <div className="details-page__thumbnails">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  className={`details-page__thumbnail ${i === activeImage ? "details-page__thumbnail--active" : ""}`}
                  onClick={() => setActiveImage(i)}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="details-page__info">
          <span className="details-page__category">{product.category}</span>
          <h1 className="details-page__name">{product.name}</h1>

          <div className="details-page__highlights">
            {generalHighlights.map(({ label, display }) => (
              <span key={label}>
                <strong>{label}</strong>
                <span>{display}</span>
              </span>
            ))}
            <span>
              <strong>Stock</strong>
              <span>{outOfStock ? "Out of stock" : `${product.stock} available`}</span>
            </span>
          </div>

          <div className="details-page__price-row">
            <span className="details-page__price">${product.price}</span>
          </div>

          {product.description && <p className="details-page__description">{product.description}</p>}

          <div className="details-page__actions">
            <button
              type="button"
              className="details-page__cart-btn"
              onClick={handleAddToCart}
              disabled={outOfStock}
              aria-label="Add to cart"
            >
              <ShoppingCart size={19} />
            </button>
            <button type="button" className="details-page__buy-btn" onClick={handleBuyNow} disabled={outOfStock}>
              {outOfStock ? "Out of stock" : "Buy now"}
            </button>
          </div>
        </div>
      </div>

      <DetailSpecs category={product.category} specifications={product.specifications} />

      {sliderOpen && <ImageSlider images={images} initialIndex={activeImage} onClose={() => setSliderOpen(false)} />}
    </main>
  )
}

export default Details