const jwt = require("jsonwebtoken")
require("dotenv").config()
const secret = process.env.JWT_SECRET

const verifyToken = (req, res, next) => {
  const token = req.cookies.authToken || req.headers["authorization"]

  if (!token) {
    return res.status(401).json({ error: "No token provided" })
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to authenticate token", error: err })
    }
    req.userId = decoded.userId
    next()
  })
}

module.exports = verifyToken
