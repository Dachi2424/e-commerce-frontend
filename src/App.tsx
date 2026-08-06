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
const Checkout = lazy(() => import("./pages/Checkout/Checkout"))
const AdminProducts = lazy(() => import("./pages/AdminProducts/AdminProducts"))
const ProductForm = lazy(() => import("./pages/ProductForm/ProductForm"))

const ProfileLayout = lazy(() => import("./pages/Profile/ProfileLayout"))
const PersonalInfo = lazy(() => import("./pages/Profile/PersonalInfo"))
const Account = lazy(() => import("./pages/Profile/Account"))
const Orders = lazy(() => import("./pages/Profile/Orders"))
const OrderDetail = lazy(() => import("./pages/Profile/OrderDetail"))


function App() {

  return (
    <>
      <BrowserRouter>
        <div className='body-wrapper'>
          <Header />
          <Suspense fallback={<div className='app__suspense-loader'></div>}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/auth' element={<Auth />} />
              <Route path='/products' element={<Products />} />
              <Route path='/products/:id' element={<Details />} />
              <Route path='/checkout' element={<Checkout />} />

              <Route element={<ProtectedRoute />}>
                <Route path='/admin/products' element={<AdminProducts/>} />
                <Route path='/admin/products/new' element={<ProductForm/>} />
                <Route path='/admin/products/:id/edit' element={<ProductForm/>} />
              </Route>

              <Route element={<ProtectedRoute requireAdmin />}>
                <Route path='/profile' element={<ProfileLayout/>}>
                  <Route path="personal-info" element={<PersonalInfo />} />
                  <Route path="account" element={<Account />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="orders/:id" element={<OrderDetail />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
