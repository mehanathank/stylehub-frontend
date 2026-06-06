const express = require('express')
const router = express.Router()
const { getWishlist, saveWishlist } = require('../Controllers/WishlistController')

router.get('/:userId', getWishlist)
router.post('/', saveWishlist)

module.exports = router
