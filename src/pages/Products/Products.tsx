import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import axios, { isAxiosError } from "axios"
import ProductGrid from "../../components/ProductGrid/ProductGrid"
import Pagination from "../../components/Pagination/Pagination"
import { NavLink } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import "./Products.scss"

type Product = {
  id: number
  name: string
  price: string
  stock: number
  category: string
  imageUrl: string[]
}

const PAGE_SIZE = 24

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categoryParams] = useSearchParams()

  let category = categoryParams.get("category")

  if (category) {
    category = category.charAt(0).toUpperCase() + category.slice(1)
  }

  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1)
  const sort = searchParams.get("sort") === "desc" ? "desc" : "asc"

  useEffect(() => {
    fetchProducts()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()])

  async function fetchProducts() {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams(searchParams)

      params.set("page", String(currentPage))
      params.set("limit", String(PAGE_SIZE))

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/products`,
        { params }
      )

      if (Array.isArray(res.data)) {
        setProducts(res.data)
        setTotalCount(Number(res.headers["x-total-count"]) || 0)
      } else {
        setProducts([])
        setTotalCount(0)
        setError("Products are currently unavailable")
      }
    } catch (err) {
      setProducts([])
      setTotalCount(0)

      setError(
        isAxiosError(err)
          ? err.response?.data?.error || "Failed to load products"
          : "Failed to load products"
      )
    } finally {
      setLoading(false)
    }
  }

  function handleSortChange(nextSort: string) {
    const next = new URLSearchParams(searchParams)

    next.set("sort", nextSort)
    next.set("page", "1")

    setSearchParams(next)
  }

  function handlePageChange(page: number) {
    const next = new URLSearchParams(searchParams)

    next.set("page", String(page))
    setSearchParams(next)

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  return (
    <main>
      <div className="products-page__main">

        <div className="products-page__navigation">
          <NavLink to="/">Home page</NavLink>

          <ChevronRight
            size={13}
            className="products-page__chevron"
          />

          <span>
            {category ? `${category}s` : "All products"}
          </span>
        </div>

        <div className="products-page__category-name-container">

          <h2 className="products-page__category-name">
            {category ? `${category}s` : "All products"}
          </h2>

          <label className="products-page__sort">
            <span>Sort by</span>

            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </label>

        </div>

        <div className="products-page__toolbar">
          <span className="products-page__count">
            {loading
              ? "Loading…"
              : `${totalCount} product${totalCount === 1 ? "" : "s"}`}
          </span>
        </div>

        <ProductGrid
          products={products}
          loading={loading}
          error={error}
        />

        <Pagination
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
        />

      </div>
    </main>
  )
}

