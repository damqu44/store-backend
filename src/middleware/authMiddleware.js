const verifyToken = (req, res, next) => {
  try {
    // const token  req.cookies.authToken || req.headers.authorization?.split(" ")[1] // Obsługa Bearer token
    const token = req.cookies.authToken || req.headers["authorization"]

    if (!token) {
      return res.status(401).json({
        error: "No token provided",
        message: req.cookies,
        token: req.cookies.authToken,
      })
    }

    const decoded = jwt.verify(token, secret)
    req.userId = decoded.userId
    next()
  } catch (err) {
    res.status(403).json({
      error: "Invalid or expired token",
      message: req.cookies,
      token: req.cookies.authToken,
    })
  }
}

module.exports = verifyToken
