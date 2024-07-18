function customCors(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080') // Specyficzny origin Twojego frontendu
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  )
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true') // Umożliwienie wysyłania i odbierania cookies
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
}

module.exports = customCors
