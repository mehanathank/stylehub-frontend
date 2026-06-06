import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import { FiHeart } from 'react-icons/fi'
import { apiUrl } from '../api'

export default function Products() {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist()
  const toast = useToast()
  const { user } = useAuth()

  const [filter, setFilter] = useState('all')
  const [productsList, setProductsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [qtys, setQtys] = useState({})

  useEffect(() => {
    fetch(apiUrl('/api/products'))
      .then(res => res.json())
      .then(data => { setProductsList(data); setLoading(false) })
      .catch(err => { console.error('Error fetching products:', err); setLoading(false) })
  }, [])

  const filteredProducts = filter === 'all' ? productsList : productsList.filter(p => p.category === filter)

  function getQty(id) { return qtys[id] || 1 }

  function changeLocalQty(e, id, delta) {
    e.stopPropagation()
    setQtys(prev => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) + delta) }))
  }

  function handleAddToCart(e, product) {
    e.stopPropagation()
    const size = product.sizes?.length ? product.sizes[0] : 'M'
    const colour = product.colours?.length ? product.colours[0].name : 'Default'
    const qty = getQty(product.id)
    addToCart(product, size, colour, product.img, qty)
    toast(`${product.name} x${qty} added to cart!`)
    setQtys(prev => ({ ...prev, [product.id]: 1 }))
  }

  function handleWishlist(e, product) {
    e.stopPropagation()
    if (!user) { navigate('/login?redirect=/products'); return }
    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id)
      toast('Removed from wishlist.', 'info')
    } else {
      addToWishlist(product)
      toast(product.name + ' added to wishlist!')
    }
  }

  function handleProductClick(product) {
    if (product.colours?.length) navigate('/product/' + product.id)
  }

  return (
    <>
      <Navbar />

      <div className="section-pad bg-white" style={{ paddingBottom: 20 }}>
        <p className="section-title">OUR COLLECTION</p>
        <h2 className="section-heading" style={{ marginBottom: 0 }}>All Products</h2>
      </div>

      <div className="filter-bar">
        {['all', 'men', 'women', 'kids', 'baby'].map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} className={filter === cat ? 'filter-btn active' : 'filter-btn'}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="section-pad">
        {filteredProducts.length === 0 && (
          <p style={{ color: '#8b4513', textAlign: 'center' }}>No products found.</p>
        )}

        <div className="grid-4">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="product-card"
              style={{ cursor: product.colours?.length ? 'pointer' : 'default', position: 'relative' }}>

              <button
                onClick={e => handleWishlist(e, product)}
                style={{
                  position: 'absolute', top: 10, right: 10,
                  background: '#fff', border: '1px solid #e0c9a6',
                  borderRadius: '50%', width: 34, height: 34,
                  cursor: 'pointer', fontSize: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1,
                  color: isWishlisted(product.id) ? '#c0392b' : '#aaa'
                }}>
                <FiHeart style={{ fill: isWishlisted(product.id) ? '#c0392b' : 'none' }} />
              </button>

              <img src={product.img} alt={product.name} className="product-img" />

              <div className="product-info">
                <p className="product-cat">{product.category}</p>
                <h5 className="product-name">{product.name}</h5>
                <p className="product-price">Rs. {product.price}</p>

                <div onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <button onClick={e => changeLocalQty(e, product.id, -1)} style={{ width: 24, height: 24, border: '1px solid #e0c9a6', background: '#fdf6ee', color: '#8b4513', borderRadius: 5, cursor: 'pointer', fontSize: 14, fontWeight: 700, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#8b4513', minWidth: 16, textAlign: 'center' }}>{getQty(product.id)}</span>
                  <button onClick={e => changeLocalQty(e, product.id, 1)} style={{ width: 24, height: 24, border: '1px solid #e0c9a6', background: '#fdf6ee', color: '#8b4513', borderRadius: 5, cursor: 'pointer', fontSize: 14, fontWeight: 700, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                </div>

                <button onClick={e => handleAddToCart(e, product)} className="product-add-btn">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  )
}
