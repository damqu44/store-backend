const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')
const verifyToken = require('../middleware/authMiddleware')

router.get('/', verifyToken, orderController.getOrders)

module.exports = router
