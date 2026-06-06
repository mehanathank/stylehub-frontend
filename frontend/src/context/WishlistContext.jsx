import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { apiUrl } from '../api'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    if (user?.id) {
      fetch(apiUrl(`/api/wishlist/${user.id}`))
        .then(res => res.json())
        .then(data => setWishlist(Array.isArray(data) ? data : []))
        .catch(() => setWishlist([]))
    } else {
      setWishlist([])
    }
  }, [user?.id])

  async function save(items) {
    const clean = items.map(({ _id, __v, ...rest }) => rest)
    setWishlist(clean)
    if (user?.id) {
      await fetch(apiUrl('/api/wishlist'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, items: clean })
      })
    }
  }

  function addToWishlist(product) {
    if (!user?.id || wishlist.find(i => i.id === product.id)) return
    save([...wishlist, product])
  }

  function removeFromWishlist(id) {
    if (!user?.id) return
    save(wishlist.filter(i => i.id !== id))
  }

  function isWishlisted(id) { return wishlist.some(i => i.id === id) }

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() { return useContext(WishlistContext) }
