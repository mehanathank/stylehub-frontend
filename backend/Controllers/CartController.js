const Cart = require('../Models/CartModel')

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId })
    res.status(200).json(cart ? cart.items : [])
  } catch (error) {
    res.status(500).json({ message: 'Failed to get cart', error: error.message })
  }
}

const saveCart = async (req, res) => {
  try {
    const { userId, items } = req.body
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { userId, items },
      { upsert: true, new: true }
    )
    res.status(200).json({ message: 'Cart saved', data: cart.items })
  } catch (error) {
    res.status(400).json({ message: 'Failed to save cart', error: error.message })
  }
}

const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ userId: req.params.userId }, { items: [] })
    res.status(200).json({ message: 'Cart cleared' })
  } catch (error) {
    res.status(400).json({ message: 'Failed to clear cart', error: error.message })
  }
}

module.exports = { getCart, saveCart, clearCart }
