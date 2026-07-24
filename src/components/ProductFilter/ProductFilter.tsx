import { useSearchParams } from "react-router-dom"
import PriceRangeSlider from "../PriceRangeSlider/PriceRangeSlider"
import SpecFilterForm, { computeDependentOptions, type SpecFilterValue, type SpecFilterValues } from "./SpecFilterForm"
import { CATEGORY_SPEC_SCHEMAS } from "../../pages/ProductForm/specSchemas"
import { CATEGORIES } from "../Header/categories"
import type { SpecField } from "../../pages/ProductForm/specSchemas/types"
import "./ProductFilter.scss"

// Adjust these if your catalog's price range changes significantly.
const PRICE_MIN = 0
const PRICE_MAX = 5000

const FILTERABLE_TYPES = ["select", "boolean", "boolean-with-text"]

function buildSpecValuesFromParams(searchParams: URLSearchParams, schema: SpecField[]): SpecFilterValues {
  const result: SpecFilterValues = {}

  for (const field of schema) {
    if (!FILTERABLE_TYPES.includes(field.type)) continue
    const paramKey = `specs[${field.group}.${field.key}]`

    if (field.type === "select") {
      const vals = searchParams.getAll(paramKey)
      if (vals.length > 0) {
        result[field.group] = { ...result[field.group], [field.key]: vals }
      }
    } else {
      const val = searchParams.get(paramKey)
      if (val === "true") {
        result[field.group] = { ...result[field.group], [field.key]: true }
      }
    }
  }

  return result
}

function ProductFilter() {
  const [searchParams, setSearchParams] = useSearchParams()

  const category = searchParams.get("category") || ""
  const schema = category ? CATEGORY_SPEC_SCHEMAS[category] || [] : []

  const minPrice = Number(searchParams.get("minPrice")) || PRICE_MIN
  const maxPrice = Number(searchParams.get("maxPrice")) || PRICE_MAX
  const inStock = searchParams.get("inStock") === "true"

  const specValues = buildSpecValuesFromParams(searchParams, schema)

  function handleCategoryChange(nextCategory: string) {
    const next = new URLSearchParams(searchParams)

    // Clear every existing specs[...] param — a different category has a
    // different schema, so old spec filters no longer mean anything.
    Array.from(next.keys()).forEach((k) => {
      if (k.startsWith("specs[")) next.delete(k)
    })

    if (nextCategory) {
      next.set("category", nextCategory)
    } else {
      next.delete("category")
    }
    next.set("page", "1")
    setSearchParams(next)
  }

  function handlePriceChange([nextMin, nextMax]: [number, number]) {
    const next = new URLSearchParams(searchParams)
    next.set("minPrice", String(nextMin))
    next.set("maxPrice", String(nextMax))
    next.set("page", "1")
    setSearchParams(next)
  }

  function handleInStockChange(checked: boolean) {
    const next = new URLSearchParams(searchParams)
    if (checked) {
      next.set("inStock", "true")
    } else {
      next.delete("inStock")
    }
    next.set("page", "1")
    setSearchParams(next)
  }

  function handleSpecFilterChange(group: string, key: string, value: SpecFilterValue) {
    const paramKey = `specs[${group}.${key}]`
    const next = new URLSearchParams(searchParams)
    next.delete(paramKey)

    if (Array.isArray(value)) {
      value.forEach((v) => next.append(paramKey, v))
    } else if (value === true) {
      next.set(paramKey, "true")
    }

    // If any field depends on the one that just changed (e.g. Processor
    // Type depends on Processor Manufacturer), its currently-selected
    // values might not be valid anymore — e.g. "Apple" got unchecked, so
    // "M1" must go too, since M1 only exists under Apple.
    const newParentValues = Array.isArray(value) ? value : []
    for (const depField of schema) {
      if (depField.dependsOn !== key) continue

      const depParamKey = `specs[${depField.group}.${depField.key}]`
      const currentlySelected = next.getAll(depParamKey)
      if (currentlySelected.length === 0) continue

      const stillValidOptions = computeDependentOptions(schema, depField, newParentValues)
      const stillValidSelections = currentlySelected.filter((v) => stillValidOptions.includes(v))

      next.delete(depParamKey)
      stillValidSelections.forEach((v) => next.append(depParamKey, v))
    }

    next.set("page", "1")
    setSearchParams(next)
  }

  function handleClearAll() {
    setSearchParams(new URLSearchParams())
  }

  return (
    <aside className="product-filter">
      <div className="product-filter__header">
        <h2>Filters</h2>
        <button type="button" className="product-filter__clear" onClick={handleClearAll}>
          Clear all
        </button>
      </div>

      <div className="product-filter__section">
        <span className="product-filter__section-label">Category</span>
        <div className="product-filter__category-list">
          <label className="product-filter__category-item">
            <input type="radio" name="category" checked={category === ""} onChange={() => handleCategoryChange("")} />
            <span>All products</span>
          </label>
          {CATEGORIES.map((cat) => (
            <label key={cat.value} className="product-filter__category-item">
              <input
                type="radio"
                name="category"
                checked={category === cat.value}
                onChange={() => handleCategoryChange(cat.value)}
              />
              <span>{cat.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="product-filter__section">
        <span className="product-filter__section-label">Price</span>
        <PriceRangeSlider min={PRICE_MIN} max={PRICE_MAX} value={[minPrice, maxPrice]} onChange={handlePriceChange} />
      </div>

      <div className="product-filter__section">
        <label className="product-filter__in-stock">
          <input type="checkbox" checked={inStock} onChange={(e) => handleInStockChange(e.target.checked)} />
          <span>In stock only</span>
        </label>
      </div>

      {category && schema.length > 0 && (
        <div className="product-filter__section">
          <span className="product-filter__section-label">Specifications</span>
          <SpecFilterForm schema={schema} values={specValues} onChange={handleSpecFilterChange} />
        </div>
      )}
    </aside>
  )
}

export default ProductFilter