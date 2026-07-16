import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  Smartphone,
  Laptop,
  Tablet,
  Cpu,
  Monitor,
  Keyboard,
  Gamepad2,
  type LucideIcon,
} from "lucide-react"
import { CATEGORIES } from "./categories"

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  phone: Smartphone,
  laptop: Laptop,
  tablet: Tablet,
  pc: Cpu,
  monitor: Monitor,
  keyboard: Keyboard,
  console: Gamepad2,
}

type Props = {
  mobile?: boolean
  onNavigate?: () => void
}

function CategoryDropdown({ mobile = false, onNavigate }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (mobile) return
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [mobile])

  function handleSelect(value: string) {
    navigate(`/products?category=${value}`)
    setOpen(false)
    onNavigate?.()
  }

  if (mobile) {
    return (
      <div className="mobile-drawer__section">
        <span className="mobile-drawer__section-label">Categories</span>
        {CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.value]
          return (
            <button
              key={cat.value}
              type="button"
              className="mobile-drawer__row"
              onClick={() => handleSelect(cat.value)}
            >
              <Icon size={19} />
              <span>{cat.label}</span>
              <ChevronRight size={16} className="mobile-drawer__row-chevron" />
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="category-dropdown" ref={ref}>
      <button
        type="button"
        className="category-dropdown__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <LayoutGrid size={16} />
        <span>Categories</span>
        <ChevronDown
          size={16}
          className={`category-dropdown__chevron ${open ? "category-dropdown__chevron--open" : ""}`}
        />
      </button>
      {open && (
        <div className="category-dropdown__panel">
          <span className="category-dropdown__panel-label">Shop by category</span>
          <div className="category-dropdown__grid">
            {CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.value]
              return (
                <button
                  key={cat.value}
                  type="button"
                  className="category-dropdown__card"
                  onClick={() => handleSelect(cat.value)}
                >
                  <span className="category-dropdown__card-icon">
                    <Icon size={19} />
                  </span>
                  <span className="category-dropdown__card-label">{cat.label}</span>
                </button>
              )
            })}
          </div>
          <button
            type="button"
            className="category-dropdown__view-all"
            onClick={() => {
              navigate("/products")
              setOpen(false)
            }}
          >
            View all products →
          </button>
        </div>
      )}
    </div>
  )
}

export default CategoryDropdown