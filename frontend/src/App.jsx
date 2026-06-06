import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { WishlistProvider } from './context/WishlistContext'
import { UserRoute, AdminRoute } from './components/ProtectedRoutes'

// Public pages
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import About from './pages/About'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Forgot from './pages/Forgot'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'

// User protected pages
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import MyOrders from './pages/MyOrders'
import MyProfile from './pages/MyProfile'

// Admin pages
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AddProduct from './pages/admin/AddProduct'
import EditProduct from './pages/admin/EditProduct'
import AdminOrders from './pages/admin/AdminOrders'
import AdminUsers from './pages/admin/AdminUsers'
import AdminCoupons from './pages/admin/AdminCoupons'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <Routes>
                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot" element={<Forgot />} />

                {/* Login Required */}
                <Route path="/products" element={<UserRoute><Products /></UserRoute>} />
                <Route path="/product/:id" element={<UserRoute><ProductDetail /></UserRoute>} />
                <Route path="/cart" element={<UserRoute><Cart /></UserRoute>} />
                <Route path="/about" element={<UserRoute><About /></UserRoute>} />
                <Route path="/contact" element={<UserRoute><Contact /></UserRoute>} />
                <Route path="/faq" element={<UserRoute><FAQ /></UserRoute>} />

                {/* User Protected */}
                <Route path="/wishlist" element={<UserRoute><Wishlist /></UserRoute>} />
                <Route path="/checkout" element={<UserRoute><Checkout /></UserRoute>} />
                <Route path="/order-success" element={<UserRoute><OrderSuccess /></UserRoute>} />
                <Route path="/orders" element={<UserRoute><MyOrders /></UserRoute>} />
                <Route path="/profile" element={<UserRoute><MyProfile /></UserRoute>} />

                {/* Admin Protected */}
                <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="add-product" element={<AddProduct />} />
                  <Route path="edit-product/:id" element={<EditProduct />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="coupons" element={<AdminCoupons />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  )
}
