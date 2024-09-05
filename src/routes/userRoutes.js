const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const verifyToken = require('../middleware/authMiddleware')

router.get('/info', verifyToken, userController.getInfo)
router.get('/getaddresses', verifyToken, userController.getAddresses)
router.post(
  '/getaddressdeliverybyid',
  verifyToken,
  userController.getAddressDeliveryById
)
router.patch('/editpersonaldata', verifyToken, userController.editPersonalData)
router.patch('/editemail', verifyToken, userController.editEmail)
router.patch('/editpassword', verifyToken, userController.editPassword)
router.patch('/edittelephone', verifyToken, userController.editTelephoneNumber)
router.patch(
  '/editaddressdelivery',
  verifyToken,
  userController.editAddressDelivery
)
router.post(
  '/addaddressdelivery',
  verifyToken,
  userController.addAddressDelivery
)
router.delete(
  '/deleteaddressdelivery',
  verifyToken,
  userController.deleteAddressDelivery
)
router.patch(
  '/editprimaryaddressdelivery',
  verifyToken,
  userController.editPrimaryAddressDelivery
)
module.exports = router
