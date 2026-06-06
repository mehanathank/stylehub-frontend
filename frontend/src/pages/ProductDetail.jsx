import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import { FiHeart } from 'react-icons/fi'
import { apiUrl } from '../api'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, cart } = useCart()
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist()
  const toast = useToast()
  const { user } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mainImg, setMainImg] = useState('')
  const [selectedSize, setSelectedSize] = useState('M')
  const [selectedColour, setSelectedColour] = useState('Default')
  const [selectedQty, setSelectedQty] = useState(1)

  useEffect(() => {
    fetch(apiUrl('/api/products'))
      .then(res => res.json())
      .then(products => {
        const found = products.find(p => p.id === parseInt(id))
        if (found) {
          setProduct(found)
          setMainImg(found.frontImg || found.colours?.[0]?.img || found.img)
          setSelectedSize(found.sizes?.[0] || 'M')
          setSelectedColour(found.colours?.[0]?.name || 'Default')
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching product details:', err)
        setLoading(false)
      })
  }, [id])

  if (loading) return <><Navbar /><p style={{ padding: 40, color: '#8b4513', textAlign: 'center' }}>Loading product details...</p><Footer /></>

  if (!product) return <><Navbar /><p style={{ padding: 40, color: '#8b4513', textAlign: 'center' }}>Product not found.</p><Footer /></>

  function handleColour(c) { setMainImg(c.img); setSelectedColour(c.name) }

  function getCartQty() {
    const item = cart.find(i => i.id === product?.id && i.size === selectedSize && i.colour === selectedColour)
    return item ? item.qty : 0
  }

  function handleAddToCart() {
    addToCart(product, selectedSize, selectedColour, mainImg, selectedQty)
    toast(`${product.name} x${selectedQty} added to cart!`)
    setSelectedQty(1)
  }

  function handleWishlist() {
    if (!user) { navigate('/login?redirect=/product/' + product.id); return }
    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id)
      toast('Removed from wishlist.', 'info')
    } else {
      addToWishlist(product)
      toast(`${product.name} added to wishlist!`)
    }
  }

  return (
    <>
      <Navbar />
      <div className="pd-page">
        <button onClick={() => navigate('/products')} className="pd-back">← Back to Shop</button>
        <div className="pd-grid">
          <div className="pd-images">
            <img src={mainImg} alt={product.name} className="pd-main-img" />
            {product.colours && (
              <div className="pd-thumbs">
                {product.colours.map(c => (
                  <img key={c.name} src={c.img} alt={c.name} onClick={() => handleColour(c)}
                    className={`pd-thumb${mainImg === c.img ? ' active' : ''}`} />
                ))}
              </div>
            )}
          </div>
          <div className="pd-details">
            <span className="pd-badge">{product.category.toUpperCase()}</span>
            <h1 className="pd-name">{product.name}</h1>
            <p className="pd-price">Rs. {product.price}</p>
            <p className="pd-desc">{product.description}</p>
            {product.colours && (
              <div>
                <p className="pd-label">Select Colour</p>
                <div className="pd-thumbs">
                  {product.colours.map(c => (
                    <img key={c.name} src={c.img} alt={c.name} title={c.name} onClick={() => handleColour(c)}
                      className={`pd-thumb${selectedColour === c.name ? ' active' : ''}`} />
                  ))}
                </div>
              </div>
            )}
            {product.sizes && (
              <div>
                <p className="pd-label">Select Size</p>
                <div className="pd-sizes">
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className={`size-btn${selectedSize === s ? ' active' : ''}`}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button type="button" onClick={() => setSelectedQty(q => Math.max(1, q - 1))} style={{ width: 28, height: 28, border: '1px solid #e0c9a6', background: '#fdf6ee', color: '#8b4513', borderRadius: 6, cursor: 'pointer', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#8b4513', minWidth: 20, textAlign: 'center' }}>{selectedQty}</span>
                <button type="button" onClick={() => setSelectedQty(q => q + 1)} style={{ width: 28, height: 28, border: '1px solid #e0c9a6', background: '#fdf6ee', color: '#8b4513', borderRadius: 6, cursor: 'pointer', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              </div>
              <button onClick={handleAddToCart} className="pd-add-btn" style={{ flex: 1 }}>Add to Cart</button>
              <button onClick={handleWishlist} style={{
                background: '#fff',
                border: '1px solid #e0c9a6',
                borderRadius: 8, padding: '0 14px', cursor: 'pointer', fontSize: 18,
                color: isWishlisted(product.id) ? '#c0392b' : '#aaa',
                display: 'flex', alignItems: 'center'
              }}><FiHeart style={{ fill: isWishlisted(product.id) ? '#c0392b' : 'none' }} /></button>
            </div>
            <div className="pd-details-box">
              <p className="pd-label">Product Details</p>
              <ul className="pd-detail-list">
                {product.details?.map(d => <li key={d}>{d}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
