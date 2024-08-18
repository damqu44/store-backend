const express = require('express')
const path = require('path')
const customCors = require('./middleware/cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const productRoutes = require('./routes/productRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const searchRoutes = require('./routes/searchRoutes')
const cartRoutes = require('./routes/cartRoutes')
const transactionRoutes = require('./routes/transactionRoutes')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')

const app = express()
const port = 3000

app.use(customCors)
app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

app.use(cookieParser())
app.use(
  session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: false, sameSite: 'lax' },
  })
)

app.get('/favicon.ico', (req, res) => res.status(204).end())

app.use('/auth', authRoutes)
app.use('/products', productRoutes)
app.use('/categories', categoryRoutes)
app.use('/cart', cartRoutes)
app.use('/transaction', transactionRoutes)
app.use('/search', searchRoutes)
app.use('/user', userRoutes)

app.get('/product', (req, res) => {
  const { id } = req.query
  if (id) {
    res.send(`Product ID: ${id}`)
  } else {
    res.status(400).send('Product ID not provided')
  }
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
