// const jwt = require("jsonwebtoken")
// require("dotenv").config()
// const secret = process.env.JWT_SECRET

// const verifyToken = (req, res, next) => {
//   const token = req.cookies.authToken || req.headers["authorization"]

//   if (!token) {
//     return res.status(401).json({ error: "No token provided" })
//   }

//   jwt.verify(token, secret, (err, decoded) => {
//     if (err) {
//       return res
//         .status(500)
//         .json({ message: "Failed to authenticate token", error: err })
//     }
//     req.userId = decoded.userId
//     next()
//   })
// }

// module.exports = verifyToken

const verifyToken = (req, res, next) => {
  try {
    // const token  req.cookies.authToken || req.headers.authorization?.split(" ")[1] // Obsługa Bearer token
    const token = req.cookies.authToken || req.headers["authorization"]

    if (!token) {
      return res.status(401).json({ error: "No token provided" })
    }

    const decoded = jwt.verify(token, secret)
    req.userId = decoded.userId
    next()
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" })
  }
}

module.exports = verifyToken
