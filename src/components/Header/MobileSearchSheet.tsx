import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Search } from "lucide-react"

type ProductResult = {
  id: number
  name: string
  price: string
  imageUrl: string[]
}

type Props = {
  open: boolean
  onClose: () => void
}

const DEBOUNCE_MS = 800

function MobileSearchSheet({ open, onClose }: Props) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<ProductResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (open) {
      // small delay so it focuses after the sheet has slid into view
      const t = setTimeout(() => inputRef.current?.focus(), 200)
      return () => clearTimeout(t)
    }
    setQuery("")
    setResults([])
  }, [open])

  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      setResults([])
      return
    }
    setLoading(true)
    const timeoutId = setTimeout(async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`, {
          params: { search: trimmed, limit: 8 },
        })
        setResults(res.data)
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
    onClose()
  }

  function goToProduct(id: number) {
    navigate(`/products/${id}`)
    onClose()
  }

  return (
    <>
      {open && <div className="mobile-search-sheet__backdrop" onClick={onClose} />}
      <div className={`mobile-search-sheet ${open ? "mobile-search-sheet--open" : ""}`}>
        <div className="mobile-search-sheet__input-row">
          <div className="mobile-search-sheet__input-wrap">
            <Search size={18} />
            <input
              ref={inputRef}
              type="text"
              className="mobile-search-sheet__input"
              placeholder="What are you looking for?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") goToResults()
              }}
            />
          </div>
          <button type="button" className="mobile-search-sheet__cancel" onClick={onClose}>
            Cancel
          </button>
        </div>

        <div className="mobile-search-sheet__results">
          {loading && <div className="mobile-search-sheet__status">Searching…</div>}
          {!loading && query.trim() && results.length === 0 && (
            <div className="mobile-search-sheet__status">No products found</div>
          )}
          {!loading &&
            results.map((product) => (
              <button
                key={product.id}
                type="button"
                className="mobile-search-sheet__result-item"
                onClick={() => goToProduct(product.id)}
              >
                <img
                  src={product.imageUrl?.[0] || "/placeholder-product.png"}
                  alt={product.name}
                  className="mobile-search-sheet__result-image"
                />
                <div className="mobile-search-sheet__result-info">
                  <span className="mobile-search-sheet__result-name">{product.name}</span>
                  <span className="mobile-search-sheet__result-price">${product.price}</span>
                </div>
              </button>
            ))}

          {!loading && query.trim() && results.length > 0 && (
            <button type="button" className="mobile-search-sheet__see-all" onClick={goToResults}>
              See all results for "{query.trim()}"
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default MobileSearchSheet