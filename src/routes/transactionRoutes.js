const express = require('express')
const router = express.Router()
const transactionController = require('../controllers/transactionController')
const verifyToken = require('../middleware/authMiddleware')

router.post('/', verifyToken, transactionController.getProducts)

module.exports = router
