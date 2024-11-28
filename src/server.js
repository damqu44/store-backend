const express = require("express")
const path = require("path")
const customCors = require("./middleware/cors")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const productRoutes = require("./routes/productRoutes")
const categoryRoutes = require("./routes/categoryRoutes")
const searchRoutes = require("./routes/searchRoutes")
const cartRoutes = require("./routes/cartRoutes")
const transactionRoutes = require("./routes/transactionRoutes")
const orderRoutes = require("./routes/orderRoutes")
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const prismaRoutes = require("./routes/prismaRoutes")
require("dotenv").config()
const secretKey = process.env.JWT_SECRET

const app = express()

app.use(customCors)
app.use(express.json())

app.use(cookieParser())
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, httpOnly: false, sameSite: "None" },
  })
)

app.get("/favicon.ico", (req, res) => res.status(204).end())

app.use("/auth", authRoutes)
app.use("/products", productRoutes)
app.use("/categories", categoryRoutes)
app.use("/cart", cartRoutes)
app.use("/transaction", transactionRoutes)
app.use("/order", orderRoutes)
app.use("/search", searchRoutes)
app.use("/user", userRoutes)
app.use("/test-connection", prismaRoutes)

app.get("/product", (req, res) => {
  const { id } = req.query
  if (id) {
    res.send(`Product ID: ${id}`)
  } else {
    res.status(400).send("Product ID not provided")
  }
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Something broke!")
})

// const port = process.env.PORT || 3000
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })
module.exports = app
