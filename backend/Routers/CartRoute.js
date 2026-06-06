const express = require('express')
const router = express.Router()
const { getCart, saveCart, clearCart } = require('../Controllers/CartController')

router.get('/:userId', getCart)
router.post('/', saveCart)
router.delete('/:userId', clearCart)

module.exports = router
