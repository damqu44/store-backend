function customCors(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*") // Specyficzny origin Twojego frontendu
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  )
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  )
  res.setHeader("Access-Control-Allow-Credentials", "true") // Umożliwienie wysyłania i odbierania cookies
  if (req.method === "OPTIONS") {
    res.sendStatus(200)
  } else {
    next()
  }
}

module.exports = customCors
