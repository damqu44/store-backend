const express = require("express")
const router = express.Router()
const prismaController = require("../controllers/prismaController")

router.get("/", prismaController.testPrismaConnection)

module.exports = router
