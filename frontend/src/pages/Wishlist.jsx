import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const { addToCart, changeQty, removeItem, cart } = useCart()
  const toast = useToast()

  function getCartQty(product) {
    const size = product.sizes?.length ? product.sizes[0] : 'M'
    const colour = product.colours?.length ? product.colours[0].name : 'Default'
    const item = cart.find(i => i.id === product.id && i.size === size && i.colour === colour)
    return item ? item.qty : 0
  }

  function moveToCart(product) {
    const size = product.sizes ? product.sizes[0] : 'M'
    const colour = product.colours ? product.colours[0].name : 'Default'
    
    addToCart(product, size, colour, product.img)
    removeFromWishlist(product.id)
    toast(product.name + ' moved to cart!')
  }
  
  function handleRemove(product) {
    removeFromWishlist(product.id)
    toast('Removed from wishlist.', 'info')
  }

  return (
    <>
      <Navbar />
      
      <div style={{ padding: '40px 60px', minHeight: '70vh' }}>
        <h2 style={{ fontFamily: 'Playfair Display,serif', color: '#6b3a2a', marginBottom: 8 }}>
          My Wishlist
        </h2>
        <p style={{ color: '#888', marginBottom: 32 }}>
          {wishlist.length} item{wishlist.length !== 1 ? 's' : ''}
        </p>

        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>❤️</p>
            <p style={{ color: '#8b4513', fontSize: 18, marginBottom: 24 }}>Your wishlist is empty</p>
            <Link to="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="grid-4">
            {wishlist.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.img} alt={product.name} className="product-img" />
                
                <div className="product-info">
                  <p className="product-cat">{product.category}</p>
                  <h5 className="product-name">{product.name}</h5>
                  <p className="product-price">Rs. {product.price}</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {getCartQty(product) > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#8b4513', borderRadius: 8, overflow: 'hidden', width: '100%' }}>
                        <button onClick={() => { const s = product.sizes?.length ? product.sizes[0] : 'M'; const c = product.colours?.length ? product.colours[0].name : 'Default'; if (getCartQty(product) <= 1) removeItem(product.id, s, c); else changeQty(product.id, s, c, -1) }} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18, fontWeight: 700, padding: '10px 0', cursor: 'pointer', lineHeight: 1, flex: 1 }}>−</button>
                        <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{getCartQty(product)}</span>
                        <button onClick={() => { const s = product.sizes?.length ? product.sizes[0] : 'M'; const c = product.colours?.length ? product.colours[0].name : 'Default'; changeQty(product.id, s, c, 1) }} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18, fontWeight: 700, padding: '10px 0', cursor: 'pointer', lineHeight: 1, flex: 1 }}>+</button>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => moveToCart(product)} className="product-add-btn" style={{ flex: 1 }}>Move to Cart</button>
                    
                      <button onClick={() => handleRemove(product)} style={{ background: 'none', border: '2px solid #c0392b', color: '#c0392b', borderRadius: 8, padding: '0 12px', cursor: 'pointer', fontWeight: 600 }}>✕</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </>
  )
}
