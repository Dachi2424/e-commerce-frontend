import axios, { isAxiosError } from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./AdminProducts.scss"





type Product = {
  id: number,
  name: string,
  price: string,
  stock: number,
  category: string,
  imageUrl: string[]
  description?: string | null,
}


export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const {refreshToken} = useAuth()


  async function fetchProducts(){
    try{
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`, {params: { limit: 100 }})
      setProducts(res.data)
    } catch(err){
      if(isAxiosError(err)){
        setError(err.response?.data?.error || err || "Failed to load products")
      }
    } finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])


  async function handleDelete(id: number){
    try{
      if(!window.confirm("Delete this product? This cannot be undone!")) return;
      await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, {withCredentials: true})
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch(err){
      if(isAxiosError(err) && err.response?.status === 401){
        await refreshToken();
        try{
          await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, {withCredentials: true})
          setProducts((prev) => prev.filter((p) => p.id !== id))
        } catch(retryErr){
          if(isAxiosError(retryErr)){
            setError(err.response?.data?.error || err || "Failed to delete the product")
          }
        }
        return;
      }
      if(isAxiosError(err)){
        setError(err.response?.data?.error || err || "Failed to delete the product")
      }
    }
  }

  return (
    <main className="admin-products">
      <div className="admin-products__header">
        <h1>Products</h1>
        <button type="button" className="admin-products__add-btn" onClick={() => navigate("/admin/products/new")}>
          Add a product
        </button>
      </div>
 
      {error && <p className="admin-products__error">{error}</p>}
      {loading && <p className="admin-products__status">Loading…</p>}
 
      {!loading && products.length === 0 && !error && (
        <p className="admin-products__status">No products yet — add your first one.</p>
      )}
 
      {!loading && products.length > 0 && (
        <div className="admin-products__grid">
          {products.map((product) => (
            <div key={product.id} className="admin-products__card">
              <img
                src={product.imageUrl?.[0] || "/placeholder-product.png"}
                alt={product.name}
                className="admin-products__card-image"
              />
              <div className="admin-products__card-info">
                <span className="admin-products__card-category">{product.category}</span>
                <span className="admin-products__card-name">{product.name}</span>
                <span className="admin-products__card-price">${product.price}</span>
                <span className="admin-products__card-stock">{product.stock} in stock</span>
              </div>
              <div className="admin-products__card-actions">
                <button type="button" onClick={() => navigate(`/admin/products/${product.id}/edit`)}>
                  Edit
                </button>
                <button type="button" className="admin-products__delete-btn" onClick={() => handleDelete(product.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
