import { Link } from "react-router-dom"
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
      {products.map((product) => (
        <Link key={product.id} to={`/products/${product.id}`} className="product-grid__card">
          <img
            src={product.imageUrl?.[0] || "/placeholder-product.png"}
            alt={product.name}
            className="product-grid__card-image"
          />
          <div className="product-grid__card-info">
            <span className="product-grid__card-category">{product.category}</span>
            <span className="product-grid__card-name">{product.name}</span>
            <span className="product-grid__card-price">${product.price}</span>
            {product.stock === 0 && <span className="product-grid__card-out-of-stock">Out of stock</span>}
          </div>
        </Link>
      ))}
    </div>
  )
}

export default ProductGrid