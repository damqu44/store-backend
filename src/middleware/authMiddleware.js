require("dotenv").config()
const secret = process.env.JWT_SECRET
const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
  try {
    const token =
      req.cookies.authToken || req.headers.authorization?.split(" ")[1] // Obsługa Bearer token

    if (!token) {
      return res.status(401).json({
        error: "No token provided",
      })
    }

    const decoded = jwt.verify(token, secret)
    req.userId = decoded.userId
    next()
  } catch (err) {
    res.status(403).json({
      error: `Invalid or expired token`,
    })
  }
}

module.exports = verifyToken
