const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cartController')
const verifyToken = require('../middleware/authMiddleware')

router.post('/database', verifyToken, cartController.addToDatabaseCart)
router.post('/cookies', cartController.addToCookiesCart)
router.get('/database', verifyToken, cartController.getDatabaseCart)
router.get('/cookies', cartController.getCookiesCart)
router.delete(
  '/database/:productId',
  verifyToken,
  cartController.removeFromDatabaseCart
)
router.delete('/cookies/:productId', cartController.removeFromCookiesCart)
router.delete('/', verifyToken, cartController.deleteCart)

module.exports = router
