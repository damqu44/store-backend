const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cartController')
const verifyToken = require('../middleware/authMiddleware')

router.post('/', verifyToken, cartController.addToCart)
router.get('/', verifyToken, cartController.getCart)
router.delete('/:productId', verifyToken, cartController.removeFromCart)

module.exports = router
