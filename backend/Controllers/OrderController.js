const Order = require('../Models/OrderModel')

const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body)
    const saved = await order.save()
    res.status(201).json({ message: 'Order placed successfully', data: saved })
  } catch (error) {
    res.status(400).json({ message: 'Failed to place order', error: error.message })
  }
}

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 })
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Failed to get orders', error: error.message })
  }
}

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Failed to get orders', error: error.message })
  }
}

const updateOrderStatus = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    if (!updated) return res.status(404).json({ message: 'Order not found' })
    res.status(200).json({ message: 'Status updated', data: updated })
  } catch (error) {
    res.status(400).json({ message: 'Failed to update status', error: error.message })
  }
}

const deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: 'Order not found' })
    res.status(200).json({ message: 'Order deleted' })
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete order', error: error.message })
  }
}

module.exports = { createOrder, getUserOrders, getAllOrders, updateOrderStatus, deleteOrder }
