const express = require("express")
const { testPrismaConnection } = require("../controllers/prismaController")
const router = express.Router()

router.get("/test-connection", testPrismaConnection)

module.exports = router
