const mongoose = require('mongoose')

const WishlistSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: [{ id: Number, name: String, category: String, price: Number, img: String, sizes: [String], colours: [{ name: String, img: String }] }]
})

module.exports = mongoose.model('Wishlist', WishlistSchema)
