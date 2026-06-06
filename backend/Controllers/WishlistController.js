const Wishlist = require('../Models/WishlistModel')

const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.userId })
    res.status(200).json(wishlist ? wishlist.items : [])
  } catch (error) {
    res.status(500).json({ message: 'Failed to get wishlist', error: error.message })
  }
}

const saveWishlist = async (req, res) => {
  try {
    const { userId, items } = req.body
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $set: { items } },
      { upsert: true, new: true }
    )
    res.status(200).json({ message: 'Wishlist saved', data: wishlist.items })
  } catch (error) {
    res.status(400).json({ message: 'Failed to save wishlist', error: error.message })
  }
}

module.exports = { getWishlist, saveWishlist }
