const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: [{ id: Number, name: String, size: String, colour: String, price: Number, qty: Number, img: String }]
})

module.exports = mongoose.model('Cart', CartSchema)
