const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String },
  userEmail: { type: String },
  items: [{ id: Number, name: String, size: String, colour: String, price: Number, qty: Number, img: String }],
  subtotal: { type: Number },
  discount: { type: Number, default: 0 },
  promoCode: { type: String, default: '' },
  total: { type: Number },
  address: {
    name: String, email: String, phone: String,
    address: String, city: String, state: String, zip: String, payment: String
  },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Order', OrderSchema)
