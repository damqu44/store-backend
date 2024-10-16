const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const addToDatabaseCart = async (req, res) => {
  try {
    const { Id, Amount, isUpdate } = req.body

    let cartData = []

    if (req.userId) {
      let cart = await prisma.cart.findUnique({
        where: { UserId: req.userId },
        include: { CartItems: true },
      })

      if (!cart) {
        cart = await prisma.cart.create({
          data: { UserId: req.userId },
        })
      }

      const cartItems = cart.CartItems || []
      const existingCartItem = cartItems.find((item) => item.ProductId === Id)

      if (existingCartItem) {
        await prisma.cartItem.update({
          where: { Id: existingCartItem.Id },
          data: {
            Amount: isUpdate ? Amount : existingCartItem.Amount + Amount,
          },
        })
      } else {
        await prisma.cartItem.create({
          data: {
            CartId: cart.Id,
            ProductId: Id,
            Amount: Amount,
          },
        })
      }

      cartData = await prisma.cart.findUnique({
        where: { UserId: req.userId },
        include: { CartItems: { include: { Product: true } } },
      })
    }

    cartData = await standardizeCartData(req.userId, cartData)

    res.status(200).send({ message: "Product data received", cartData })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
}

const addToCookiesCart = async (req, res) => {
  try {
    const { Id, Amount, isUpdate } = req.body

    let cartData = []

    cartData = req.cookies.cart ? JSON.parse(req.cookies.cart) : []

    if (!Array.isArray(cartData)) {
      cartData = []
    }

    const existingProductIndex = cartData.findIndex((item) => item.Id === Id)

    if (existingProductIndex !== -1) {
      if (isUpdate) {
        cartData[existingProductIndex].Amount = Amount
      } else {
        cartData[existingProductIndex].Amount += Amount
      }
    } else {
      cartData.push({ Id, Amount })
    }

    res.cookie("cart", JSON.stringify(cartData), {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
    })

    cartData = await standardizeCartData(req.userId, cartData)

    res
      .status(200)
      .send({ message: "Product added successfully to cookies cart", cartData })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
}

const getCookiesCart = async (req, res) => {
  try {
    let cartData = []

    cartData = req.cookies.cart ? JSON.parse(req.cookies.cart) : []

    cartData = await standardizeCartData(req.userId, cartData)

    res.status(200).send({ message: cartData })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
}
const getDatabaseCart = async (req, res) => {
  try {
    let cartData = []

    cartData = await prisma.cart.findUnique({
      where: { UserId: req.userId },
      include: {
        CartItems: {
          include: { Product: { include: { Images: { take: 1 } } } },
        },
      },
    })

    cartData = await standardizeCartData(req.userId, cartData)

    res.status(200).send({ message: cartData })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
}

const removeFromCookiesCart = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10)
    let cartData = []

    cartData = req.cookies.cart ? JSON.parse(req.cookies.cart) : []

    if (!Array.isArray(cartData)) {
      cartData = []
    }

    const updatedCartData = cartData.filter((item) => item.Id !== productId)

    res.cookie("cart", JSON.stringify(updatedCartData), {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
    })

    cartData = updatedCartData
    cartData = await standardizeCartData(req.userId, cartData)

    res.status(200).send({ message: "Product removed from cart", cartData })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
}
const removeFromDatabaseCart = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10)
    let cartData = []

    const cart = await prisma.cart.findUnique({
      where: { UserId: req.userId },
      include: { CartItems: true },
    })

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: {
          CartId: cart.Id,
          ProductId: productId,
        },
      })

      cartData = await prisma.cart.findUnique({
        where: { UserId: req.userId },
        include: {
          CartItems: {
            include: { Product: { include: { Images: { take: 1 } } } },
          },
        },
      })
    } else {
      res.status(404).send({ message: "Cart not found" })
      return
    }
    cartData = await standardizeCartData(req.userId, cartData)

    res.status(200).send({ message: "Product removed from cart", cartData })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
}

const standardizeCartData = async (userId, cartData) => {
  let standardizedCartData = []

  if (userId) {
    standardizedCartData = await Promise.all(
      cartData.CartItems.map(async (item) => {
        const deliveryMethods = await prisma.product_DeliveryMethods.findMany({
          where: { ProductId: item.Product.Id },
          include: { DeliveryMethod: true },
        })

        return {
          ...item.Product,
          cartInfo: {
            Amount: item.Amount,
            Id: item.Id,
            CartId: item.CartId,
          },
          deliveryMethods: deliveryMethods.map((dm) => dm.DeliveryMethod),
        }
      })
    )
  } else {
    for (const productData of cartData) {
      const product = await prisma.product.findUnique({
        where: { Id: productData.Id },
        include: { Images: { take: 1 } },
      })

      if (product) {
        const availableQuantity = product.Quantity
        if (productData.Amount > availableQuantity) {
          productData.Amount = availableQuantity
        }
        const deliveryMethods = await prisma.product_DeliveryMethods.findMany({
          where: { ProductId: product.Id },
          include: { DeliveryMethod: true },
        })

        standardizedCartData.push({
          ...product,
          cartInfo: {
            Amount: productData.Amount,
            Id: productData.Id,
            CartId: null,
          },
          deliveryMethods: deliveryMethods.map((dm) => dm.DeliveryMethod),
        })
      }
    }
  }
  return standardizedCartData
}

const deleteCart = async (req, res) => {
  try {
    await prisma.cart.delete({
      where: {
        UserId: req.UserId,
      },
    })

    res.status(200).send({ message: "Cart deleted" })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
}

module.exports = {
  addToDatabaseCart,
  addToCookiesCart,
  getDatabaseCart,
  getCookiesCart,
  removeFromCookiesCart,
  removeFromDatabaseCart,
  deleteCart,
}
