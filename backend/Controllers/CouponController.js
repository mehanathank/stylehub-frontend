const Coupon = require('../Models/CouponModel')

const defaultCoupons = [
  { code: 'STYLE10', discount: 10, description: '10% off on all orders' },
  { code: 'HUB20', discount: 20, description: '20% off on all orders' },
  { code: 'SAVE5', discount: 5, description: '5% off on all orders' },
]

const getCoupons = async (req, res) => {
  try {
    let coupons = await Coupon.find().sort({ createdAt: -1 })
    if (coupons.length === 0) {
      await Coupon.insertMany(defaultCoupons)
      coupons = await Coupon.find().sort({ createdAt: -1 })
    }
    res.status(200).json(coupons)
  } catch (error) {
    res.status(500).json({ message: 'Failed to get coupons', error: error.message })
  }
}

const addCoupon = async (req, res) => {
  try {
    const { code, discount, description } = req.body
    const coupon = new Coupon({ code, discount: Number(discount), description })
    const saved = await coupon.save()
    res.status(201).json({ message: 'Coupon created', data: saved })
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Coupon code already exists' })
    res.status(400).json({ message: 'Failed to create coupon', error: error.message })
  }
}

const deleteCoupon = async (req, res) => {
  try {
    const deleted = await Coupon.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: 'Coupon not found' })
    res.status(200).json({ message: 'Coupon deleted' })
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete coupon', error: error.message })
  }
}

const validateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase() })
    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' })
    const subtotal = Number(req.query.subtotal) || 0
    const discountAmount = subtotal > 0 ? Math.round((coupon.discount / 100) * subtotal) : 0
    res.status(200).json({ percent: coupon.discount, discount: discountAmount, code: coupon.code })
  } catch (error) {
    res.status(500).json({ message: 'Failed to validate coupon', error: error.message })
  }
}

module.exports = { getCoupons, addCoupon, deleteCoupon, validateCoupon }
