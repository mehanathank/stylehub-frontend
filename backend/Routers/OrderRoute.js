const express = require('express')
const router = express.Router()
const { createOrder, getUserOrders, getAllOrders, updateOrderStatus, deleteOrder } = require('../Controllers/OrderController')

router.post('/', createOrder)
router.get('/', getAllOrders)
router.get('/user/:userId', getUserOrders)
router.put('/:id', updateOrderStatus)
router.delete('/:id', deleteOrder)

module.exports = router
