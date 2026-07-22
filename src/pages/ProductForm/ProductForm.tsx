import { useState, useEffect, type FormEvent } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios, { isAxiosError } from "axios"
import SpecForm, { type SpecValue, type SpecValues } from "./SpecForm"
import { CATEGORY_SPEC_SCHEMAS } from "./specSchemas"
import { CATEGORIES } from "../../components/Header/categories"
import "./ProductForm.scss"

function ProductForm() {
  const { id } = useParams()
  const isEditMode = Boolean(id)
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [category, setCategory] = useState("")
  const [imageUrls, setImageUrls] = useState<string[]>([""])
  const [specifications, setSpecifications] = useState<SpecValues>({})

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditMode)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isEditMode) return

    async function fetchProduct() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`)
        const product = res.data
        setName(product.name)
        setDescription(product.description || "")
        setPrice(String(product.price))
        setStock(String(product.stock))
        setCategory(product.category)
        setImageUrls(product.imageUrl && product.imageUrl.length > 0 ? product.imageUrl : [""])
        setSpecifications(product.specifications || {})
      } catch (err) {
        setError(isAxiosError(err) ? err.response?.data?.error || "Failed to load product" : "Failed to load product")
      } finally {
        setFetching(false)
      }
    }

    fetchProduct()
  }, [id, isEditMode])

  function handleImageUrlChange(index: number, value: string) {
    setImageUrls((prev) => prev.map((url, i) => (i === index ? value : url)))
  }

  function handleAddImageField() {
    setImageUrls((prev) => [...prev, ""])
  }

  function handleRemoveImageField(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  function handleCategoryChange(next: string) {
    setCategory(next)
    // Different categories have different spec shapes — start fresh so
    // fields from the old category don't leak into the new payload.
    setSpecifications({})
  }

  function handleSpecChange(group: string, key: string, value: SpecValue) {
    setSpecifications((prev) => ({
      ...prev,
      [group]: { ...prev[group], [key]: value },
    }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !price || !stock || !category) {
      setError("Name, price, stock, and category are required")
      return
    }

    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      price: Number(price),
      stock: Number(stock),
      category,
      imageUrl: imageUrls.map((url) => url.trim()).filter(Boolean),
      specifications,
    }

    setLoading(true)
    try {
      if (isEditMode) {
        await axios.patch(`${import.meta.env.VITE_API_URL}/admin/products/${id}`, payload, { withCredentials: true })
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/admin/products`, payload, { withCredentials: true })
      }
      navigate("/admin/products")
    } catch (err) {
      setError(isAxiosError(err) ? err.response?.data?.error || "Something went wrong" : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const schema = CATEGORY_SPEC_SCHEMAS[category] || []

  if (fetching) {
    return (
      <main className="product-form-page">
        <p className="product-form-page__status">Loading product…</p>
      </main>
    )
  }

  return (
    <main className="product-form-page">
      <h1 className="product-form-page__title">{isEditMode ? "Edit product" : "Add a product"}</h1>

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="product-form__basics">
          <label className="product-form__field">
            <span>Name</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label className="product-form__field">
            <span>Category</span>
            <select value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
              <option value="" disabled>
                Select a category…
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </label>

          <label className="product-form__field">
            <span>Price</span>
            <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
          </label>

          <label className="product-form__field">
            <span>Stock</span>
            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
          </label>

          <label className="product-form__field product-form__field--full">
            <span>Description</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </label>

          <div className="product-form__field product-form__field--full">
            <span>Image URLs</span>
            <div className="product-form__image-list">
              {imageUrls.map((url, index) => (
                <div key={index} className="product-form__image-row">
                  <input
                    type="text"
                    value={url}
                    placeholder="https://…"
                    onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  />
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      className="product-form__image-remove"
                      onClick={() => handleRemoveImageField(index)}
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" className="product-form__add-image-btn" onClick={handleAddImageField}>
              + Add image
            </button>
          </div>
        </div>

        {category && (
          <>
            <h2 className="product-form__section-title">Specifications</h2>
            <SpecForm schema={schema} values={specifications} onChange={handleSpecChange} />
          </>
        )}

        {error && <p className="product-form__error">{error}</p>}

        <button type="submit" className="product-form__submit" disabled={loading}>
          {loading ? "Saving…" : isEditMode ? "Save changes" : "Create product"}
        </button>
      </form>
    </main>
  )
}

export default ProductForm;