import { lazy, Suspense } from 'react'
import './App.scss'
import { BrowserRouter, Routes, Route} from "react-router-dom"
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import ProtectedRoute from './components/ProtectedRoute'
const Home = lazy(() => import("./pages/Home/Home"))
const Products = lazy(() => import("./pages/Products/Products"))
const Details = lazy(() => import("./pages/Details/Details"))
const Auth = lazy(() => import("./pages/Auth/Auth"))
const AdminProducts = lazy(() => import("./pages/AdminProducts/AdminProducts"))
const ProductForm = lazy(() => import("./pages/ProductForm/ProductForm"))


function App() {

  return (
    <>
      <BrowserRouter>
        <Header />
        <Suspense fallback={<div className='app__suspense-loader'></div>}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/auth' element={<Auth />} />
            <Route path='/products' element={<Products />} />
            <Route path='/products/:id' element={<Details />} />

            <Route element={<ProtectedRoute />}>
              <Route path='/admin/products' element={<AdminProducts/>} />
              <Route path='/admin/products/new' element={<ProductForm/>} />
              <Route path='/admin/products/:id/edit' element={<ProductForm/>} />
            </Route>
          </Routes>
        </Suspense>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
