import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Search } from "lucide-react"
import { createPortal } from "react-dom"
import { CATEGORIES } from "./categories"

type ProductResult = {
  id: number
  name: string
  price: string
  imageUrl: string[]
}

const DEBOUNCE_MS = 800
const PAGE_SIZE = 10

function SearchBar({ onNavigate }: { onNavigate?: () => void }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<ProductResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [availableCategories, setAvailableCategories] = useState<string[]>([])

  const wrapperRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      // The results panel is rendered via a portal to document.body, so
      // it's NOT a DOM descendant of wrapperRef even though it's the
      // same component — without checking it separately, every click
      // inside the results (a category, a product, load more) looks
      // like an "outside" click and closes the panel instantly.
      const clickedInsideInput = wrapperRef.current?.contains(target)
      const clickedInsideResults = resultsRef.current?.contains(target)
      if (!clickedInsideInput && !clickedInsideResults) {
        setShowResults(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // A brand new search term always starts fresh — back to 10 results,
  // no category filter carried over from the last search.
  useEffect(() => {
    setLimit(PAGE_SIZE)
    setActiveCategory(null)
  }, [query])

  // Main results fetch — reacts to the search term, the active category
  // tab, and however many results we've asked to see (limit).
  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      setResults([])
      setAvailableCategories([])
      setShowResults(false)
      return
    }

    setLoading(true)
    const timeoutId = setTimeout(async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`, {
          params: {
            search: trimmed,
            limit,
            ...(activeCategory ? { category: activeCategory } : {}),
          },
        })
        setResults(res.data)
        setShowResults(true)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    }, DEBOUNCE_MS)

    return () => clearTimeout(timeoutId)
  }, [query, activeCategory, limit])

  // Figure out which categories actually contain a match for this search
  // term, so the sidebar only ever shows relevant categories. Runs once
  // per new search term (not on every category click or "load more"),
  // as 7 small parallel requests — one per category, limit 1, just to
  // check existence.
  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) return

    const timeoutId = setTimeout(async () => {
      try {
        const checks = await Promise.all(
          CATEGORIES.map((cat) =>
            axios
              .get(`${import.meta.env.VITE_API_URL}/products`, {
                params: { search: trimmed, category: cat.value, limit: 1 },
              })
              .then((res) => (res.data.length > 0 ? cat.value : null))
              .catch(() => null)
          )
        )
        setAvailableCategories(checks.filter((v): v is NonNullable<typeof v> => v !== null))
      } catch {
        setAvailableCategories([])
      }
    }, DEBOUNCE_MS)

    return () => clearTimeout(timeoutId)
  }, [query])

  function goToResults() {
    const trimmed = query.trim()
    if (!trimmed) return
    const categoryParam = activeCategory ? `&category=${activeCategory}` : ""
    navigate(`/products?search=${encodeURIComponent(trimmed)}${categoryParam}`)
    setShowResults(false)
    onNavigate?.()
  }

  function goToProduct(id: number) {
    navigate(`/products/${id}`)
    setShowResults(false)
    onNavigate?.()
  }

  function handleCategoryClick(value: string | null) {
    setActiveCategory(value)
    setLimit(PAGE_SIZE)
  }

  function handleLoadMore() {
    setLoadingMore(true)
    setLimit((prev) => prev + PAGE_SIZE)
  }

  // If we got back exactly as many results as we asked for, there's
  // probably more — not a guarantee, but a reasonable heuristic without
  // needing a total count from the backend.
  const hasMore = results.length === limit

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
              if (results.length > 0) setShowResults(true)
            }}
          />

          <button type="button" className="search-bar__icon" onClick={goToResults} aria-label="Search">
            <Search size={18} />
          </button>
        </div>
      </div>

      {showResults &&
        createPortal(
          <div className="search-bar__results" ref={resultsRef}>
            {loading && results.length === 0 && <div className="search-bar__status">Searching...</div>}

            {!loading && results.length === 0 && (
              <div className="search-bar__status">No products found</div>
            )}

            {results.length > 0 && (
              <div className="search-bar__main-container">
                <div className="search-bar__left-side">
                  <h3 className="search-bar__category-text">Search By Category</h3>

                  <ul className="search-bar__category-list">
                    <li
                      className={`search-bar__category ${
                        activeCategory === null ? "search-bar__category--active" : ""
                      }`}
                      onClick={() => handleCategoryClick(null)}
                    >
                      All
                    </li>
                    {CATEGORIES.filter((cat) => availableCategories.includes(cat.value)).map((cat) => (
                      <li
                        key={cat.value}
                        className={`search-bar__category ${
                          activeCategory === cat.value ? "search-bar__category--active" : ""
                        }`}
                        onClick={() => handleCategoryClick(cat.value)}
                      >
                        {cat.label}
                      </li>
                    ))}
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
                        src={product.imageUrl?.[0] || "/placeholder-product.png"}
                        alt={product.name}
                        className="search-bar__result-image"
                      />

                      <div className="search-bar__result-info">
                        <span className="search-bar__result-name">{product.name}</span>
                        <span className="search-bar__result-price">${product.price}</span>
                      </div>
                    </button>
                  ))}

                  {hasMore && (
                    <button
                      type="button"
                      className="search-bar__load-more"
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                    >
                      {loadingMore ? "Loading…" : "Show 10 more"}
                    </button>
                  )}
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