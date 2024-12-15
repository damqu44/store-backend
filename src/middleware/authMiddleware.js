require("dotenv").config()
const secret = process.env.JWT_SECRET
const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
  const token =
    req.cookies.authToken || req.headers.authorization?.split(" ")[1] // Obsługa Bearer token

  if (!token) {
    return res
      .status(401)
      .json({ authenticated: false, message: "No token provided" })
  }

  try {
    const decoded = jwt.verify(token, secret)
    req.userId = decoded.userId
    next()
  } catch (err) {
    return res
      .status(401)
      .json({ authenticated: false, message: "Invalid token" })
  }
}

module.exports = verifyToken
