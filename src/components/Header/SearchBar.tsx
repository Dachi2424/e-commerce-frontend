import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Search } from "lucide-react"
import { createPortal } from "react-dom"

type ProductResult = {
  id: number
  name: string
  price: string
  imageUrl: string[]
}

const DEBOUNCE_MS = 800

function SearchBar({ onNavigate }: { onNavigate?: () => void }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<ProductResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const trimmed = query.trim()

    if (!trimmed) {
      setResults([])
      setShowResults(false)
      return
    }

    setLoading(true)

    const timeoutId = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/products`,
          {
            params: {
              search: trimmed,
              limit: 10,
            },
          }
        )

        setResults(res.data)
        setShowResults(true)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => clearTimeout(timeoutId)
  }, [query])

  function goToResults() {
    const trimmed = query.trim()

    if (!trimmed) return

    navigate(`/products?search=${encodeURIComponent(trimmed)}`)
    setShowResults(false)
    onNavigate?.()
  }

  function goToProduct(id: number) {
    navigate(`/products/${id}`)
    setShowResults(false)
    onNavigate?.()
  }

  return (
    <>
      <div className="search-bar" ref={wrapperRef}>
        <div className="search-bar__input-wrap">
          <input
            type="text"
            className="search-bar__input"
            placeholder="What are you looking for?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") goToResults()
            }}
            onFocus={() => {
              if (results.length > 0) {
                setShowResults(true)
              }
            }}
          />

          <button
            type="button"
            className="search-bar__icon"
            onClick={goToResults}
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {showResults &&
        createPortal(
          <div className="search-bar__results">
            {loading && (
              <div className="search-bar__status">
                Searching...
              </div>
            )}

            {!loading && results.length === 0 && (
              <div className="search-bar__status">
                No products found
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="search-bar__main-container">

                <div className="search-bar__left-side">
                  <h3 className="search-bar__category-text">
                    Search By Category
                  </h3>

                  <ul className="search-bar__category-list">
                    <li className="search-bar__category">Phones</li>
                    <li className="search-bar__category">Laptops</li>
                    <li className="search-bar__category">Consoles</li>
                    <li className="search-bar__category">Monitors</li>
                    <li className="search-bar__category">Tablets</li>
                    <li className="search-bar__category">Accessories</li>
                  </ul>
                </div>

                <div className="search-bar__right-side">
                  {results.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      className="search-bar__result-item"
                      onClick={() => goToProduct(product.id)}
                    >
                      <img
                        src={
                          product.imageUrl?.[0] ||
                          "/placeholder-product.png"
                        }
                        alt={product.name}
                        className="search-bar__result-image"
                      />

                      <div className="search-bar__result-info">
                        <span className="search-bar__result-name">
                          {product.name}
                        </span>

                        <span className="search-bar__result-price">
                          ${product.price}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

              </div>
            )}
          </div>,
          document.body
        )}
    </>
  )
}

export default SearchBar