const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const verifyToken = require('../middleware/authMiddleware')

router.get('/info', verifyToken, userController.getInfo)
router.get('/getaddresses', verifyToken, userController.getAddresses)
router.patch('/editpersonaldata', verifyToken, userController.editPersonalData)
router.patch('/editemail', verifyToken, userController.editEmail)
router.patch('/editpassword', verifyToken, userController.editPassword)
router.patch('/edittelephone', verifyToken, userController.editTelephoneNumber)
router.post(
  '/addaddressdelivery',
  verifyToken,
  userController.addAddressDelivery
)
module.exports = router
