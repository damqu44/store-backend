const jwt = require('jsonwebtoken')
const secret = 'your_jwt_secret'

const verifyToken = (req, res, next) => {
  const token = req.cookies.authToken || req.headers['authorization']

  if (!token) {
    return next()
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to authenticate token' })
    }
    req.userId = decoded.userId
    next()
  })
}

module.exports = verifyToken
