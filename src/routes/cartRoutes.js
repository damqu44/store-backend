const express = require("express")
const router = express.Router()
const cartController = require("../controllers/cartController")
const verifyToken = require("../middleware/authMiddleware")

router.post("/", verifyToken, cartController.addToCart)
router.get("/", verifyToken, cartController.getCart)
router.delete("/:productId", verifyToken, cartController.removeFromCart) // Usuwanie produktu z koszyka dla zalogowanych
router.delete("/", verifyToken, cartController.deleteCart) // Usuwanie całego koszyka dla zalogowanych

router.post("/cookies", cartController.addToCart) // Dodawanie do koszyka dla niezalogowanych
router.get("/cookies", cartController.getCart) // Pobieranie koszyka dla niezalogowanych
router.delete("/cookies/:productId", cartController.removeFromCart) // Usuwanie produktu z koszyka dla niezalogowanych

module.exports = router
