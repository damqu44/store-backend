require("dotenv").config()

const verifyToken = (req, res, next) => {
  try {
    const token =
      req.cookies.authToken || req.headers.authorization?.split(" ")[1] // Obsługa Bearer token

    if (!token) {
      return res.status(401).json({
        error: "No token provided",
        message: req.cookies,
        token: req.cookies.authToken,
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) // Pobierz sekret z env
    req.userId = decoded.userId
    next()
  } catch (err) {
    res.status(403).json({
      error: `Invalid or expired token ${err}}`,
      message: req.cookies,
      token: req.cookies.authToken,
    })
  }
}

module.exports = verifyToken
