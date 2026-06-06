import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { apiUrl } from '../api'

const CartContext = createContext()

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState([])

  useEffect(() => {
    if (user?.id) {
      fetch(apiUrl(`/api/cart/${user.id}`))
        .then(res => res.json())
        .then(data => setCart(Array.isArray(data) ? data : []))
        .catch(() => setCart([]))
    } else {
      setCart([])
    }
  }, [user?.id])

  async function saveCart(items) {
    setCart(items)
    if (user?.id) {
      await fetch(apiUrl('/api/cart'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, items })
      })
    }
  }

  function addToCart(product, size, colour, img, qty = 1) {
    const updated = [...cart]
    const existing = updated.find(i => i.id === product.id && i.size === size && i.colour === colour)
    if (existing) { existing.qty += qty }
    else { updated.push({ id: product.id, name: product.name, size, colour, price: product.price, qty, img }) }
    saveCart(updated)
  }

  function changeQty(id, size, colour, change) {
    saveCart(cart.map(i => i.id === id && i.size === size && i.colour === colour ? { ...i, qty: Math.max(1, i.qty + change) } : i))
  }

  function removeItem(id, size, colour) {
    saveCart(cart.filter(i => !(i.id === id && i.size === size && i.colour === colour)))
  }

  async function clearCart() {
    setCart([])
    if (user?.id) {
      await fetch(apiUrl(`/api/cart/${user.id}`), { method: 'DELETE' })
    }
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, changeQty, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() { return useContext(CartContext) }
