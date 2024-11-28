const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
require("dotenv").config()
const secret = process.env.JWT_SECRET
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(email)
}

const validatePhoneNumber = (phone) => {
  const phonePattern = /^\d{9}$/
  return phonePattern.test(phone)
}

const register = async (req, res) => {
  const { email, password, userName, userLastName, telephone } = req.body

  if (!email || !password || !userName || !userLastName || !telephone) {
    return res.status(400).json({ error: "All fields are required" })
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" })
  }

  if (!validatePhoneNumber(telephone)) {
    return res
      .status(400)
      .json({ error: "Invalid phone number format. Must be 9 digits" })
  }

  try {
    const existingEmail = await prisma.user.findUnique({
      where: { Email: email },
    })

    if (existingEmail) {
      return res.status(400).json({ error: "Email already in use" })
    }

    const existingPhone = await prisma.user.findUnique({
      where: { Telephone: parseInt(telephone, 10) },
    })

    if (existingPhone) {
      return res.status(400).json({ error: "Phone number already in use" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.$transaction(async (prisma) => {
      const newUser = await prisma.user.create({
        data: {
          Email: email,
          Password: hashedPassword,
          Name: userName,
          LastName: userLastName,
          Telephone: parseInt(telephone, 10),
        },
      })

      const cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : null
      if (cart && cart.CartItems && cart.CartItems.length > 0) {
        const newCart = await prisma.cart.create({
          data: {
            User: {
              connect: { Id: newUser.Id },
            },
          },
        })

        const cartItemsData = cart.CartItems.map((item) => ({
          CartId: newCart.Id,
          ProductId: item.ProductId,
          Amount: item.Amount,
        }))

        await prisma.cart_item.createMany({
          data: cartItemsData,
        })

        res.clearCookie("cart")
      }

      return newUser
    })

    res.status(200).json({ message: "User created:", user })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({
    where: { Email: email },
  })
  if (user && (await bcrypt.compare(password, user.Password))) {
    const token = jwt.sign({ userId: user.Id }, secret, { expiresIn: "1h" })

    res.cookie("authToken", token, {
      httpOnly: false,
      secure: true,
      maxAge: 3600000,
      sameSite: "None",
      domain: ".vercel.app",
    })

    res.json({ message: "Logged in successfully" })
  } else {
    res.status(401).json({ error: "Invalid email or password" })
  }
}

const logout = (req, res) => {
  res.clearCookie("authToken")
  res.json({ message: "Logged out successfully" })
}

module.exports = {
  register,
  login,
  logout,
}
