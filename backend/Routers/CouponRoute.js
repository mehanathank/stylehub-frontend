const express = require('express')
const router = express.Router()
const { getCoupons, addCoupon, deleteCoupon, validateCoupon } = require('../Controllers/CouponController')

router.get('/', getCoupons)
router.post('/', addCoupon)
router.delete('/:id', deleteCoupon)
router.get('/validate/:code', validateCoupon)

module.exports = router
