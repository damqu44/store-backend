const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const addToCart = async (req, res) => {
  try {
    const { Id, Amount, isUpdate } = req.body
    let cartData = []

    if (req.userId) {
      const cart = await prisma.$transaction(async (prisma) => {
        let cart = await prisma.cart.findUnique({
          where: { UserId: req.userId },
          include: { CartItems: true },
        })

        if (!cart) {
          cart = await prisma.cart.create({
            data: { UserId: req.userId },
          })
        }

        const existingCartItem = cart.CartItems.find(
          (item) => item.ProductId === Id
        )

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

        return await prisma.cart.findUnique({
          where: { UserId: req.userId },
          include: { CartItems: { include: { Product: true } } },
        })
      })

      cartData = cart
    } else {
      cartData = req.cookies.cart
        ? JSON.parse(req.cookies.cart)
        : { CartItems: [] }

      const existingProductIndex = cartData.CartItems.findIndex(
        (item) => item.ProductId === Id
      )

      if (existingProductIndex !== -1) {
        if (isUpdate) {
          cartData.CartItems[existingProductIndex].Amount = Amount
        } else {
          cartData.CartItems[existingProductIndex].Amount += Amount
        }
      } else {
        cartData.CartItems.push({ ProductId: Id, Amount: Amount })
      }

      res.cookie("cart", JSON.stringify(cartData), {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
      })
    }

    const standardizedData = await standardizeCartData(req.userId, cartData)
    res
      .status(200)
      .send({ message: "Product data received", cartData: standardizedData })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
}

const getCart = async (req, res) => {
  try {
    let cartData = []
    if (req.userId) {
      cartData = await prisma.cart.findUnique({
        where: { UserId: req.userId },
        include: {
          CartItems: {
            include: { Product: { include: { Images: { take: 1 } } } },
          },
        },
      })
    } else {
      cartData = req.cookies.cart
        ? JSON.parse(req.cookies.cart)
        : { CartItems: [] }
    }
    const standardizedData = await standardizeCartData(req.userId, cartData)

    res
      .status(200)
      .send({ message: "Cart data retrieved", cartData: standardizedData })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
}

const removeFromCart = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10)
    let cartData = []

    if (req.userId) {
      const cart = await prisma.$transaction(async (prisma) => {
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

          return await prisma.cart.findUnique({
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
      })

      if (cart) {
        cartData = cart
      }
    } else {
      cartData = req.cookies.cart
        ? JSON.parse(req.cookies.cart)
        : { CartItems: [] }
      cartData.CartItems = cartData.CartItems.filter(
        (item) => item.ProductId !== productId
      )

      res.cookie("cart", JSON.stringify(cartData), {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
      })
    }

    const standardizedData = await standardizeCartData(req.userId, cartData)
    res.status(200).send({
      message: "Product removed from cart",
      cartData: standardizedData,
    })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
}

const standardizeCartData = async (userId, cartData) => {
  let standardizedCartData = []

  if (userId) {
    if (cartData && cartData.CartItems.length > 0) {
      standardizedCartData = await Promise.all(
        cartData.CartItems.map(async (item) => {
          const deliveryMethods = await prisma.product_DeliveryMethods.findMany(
            {
              where: { ProductId: item.Product.Id },
              include: { DeliveryMethod: true },
            }
          )

          const availableQuantity = item.Product.Quantity
          if (item.Amount > availableQuantity) {
            item.Amount = availableQuantity
          }

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
      return {
        cartInfo: [],
      }
    }
  } else {
    for (const item of cartData.CartItems) {
      const product = await prisma.product.findUnique({
        where: { Id: item.ProductId },
        include: { Images: { take: 1 } },
      })
      if (product) {
        const availableQuantity = product.Quantity
        if (item.Amount > availableQuantity) {
          item.Amount = availableQuantity
        }
        const deliveryMethods = await prisma.product_DeliveryMethods.findMany({
          where: { ProductId: product.Id },
          include: { DeliveryMethod: true },
        })

        standardizedCartData.push({
          ...product,
          cartInfo: {
            Amount: item.Amount,
            Id: null,
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
    if (req.userId) {
      await prisma.$transaction(async (prisma) => {
        const cart = await prisma.cart.findUnique({
          where: {
            UserId: req.userId,
          },
        })

        if (cart) {
          await prisma.cartItem.deleteMany({
            where: {
              CartId: cart.Id,
            },
          })

          await prisma.cart.delete({
            where: {
              UserId: req.userId,
            },
          })
        }
      })
    } else {
      res.clearCookie("cart")
    }
    res.status(200).send({ message: "Cart deleted" })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
}

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  deleteCart,
}
