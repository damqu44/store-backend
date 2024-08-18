// const { PrismaClient } = require('@prisma/client')
// const prisma = new PrismaClient()

// const addToCart = async (req, res) => {
//   try {
//     const { Id, Amount, isUpdate } = req.body
//     console.log('Received product data:', { Id, Amount, isUpdate })

//     let cartData = []

//     if (req.userId) {
//       let cart = await prisma.cart.findUnique({
//         where: { UserId: req.userId },
//         include: { CartItems: true },
//       })

//       if (!cart) {
//         cart = await prisma.cart.create({
//           data: { UserId: req.userId },
//         })
//       }

//       const cartItems = cart.CartItems || []
//       const existingCartItem = cartItems.find((item) => item.ProductId === Id)

//       if (existingCartItem) {
//         await prisma.cartItem.update({
//           where: { Id: existingCartItem.Id },
//           data: {
//             Amount: isUpdate ? Amount : existingCartItem.Amount + Amount,
//           },
//         })
//       } else {
//         await prisma.cartItem.create({
//           data: {
//             CartId: cart.Id,
//             ProductId: Id,
//             Amount: Amount,
//           },
//         })
//       }

//       cartData = await prisma.cart.findUnique({
//         where: { UserId: req.userId },
//         include: { CartItems: { include: { Product: true } } },
//       })
//     } else {
//       cartData = req.cookies.cart ? JSON.parse(req.cookies.cart) : []

//       if (!Array.isArray(cartData)) {
//         cartData = []
//       }

//       const existingProductIndex = cartData.findIndex((item) => item.Id === Id)

//       if (existingProductIndex !== -1) {
//         if (isUpdate) {
//           cartData[existingProductIndex].Amount = Amount
//         } else {
//           cartData[existingProductIndex].Amount += Amount
//         }
//       } else {
//         cartData.push({ Id, Amount })
//       }

//       res.cookie('cart', JSON.stringify(cartData), {
//         httpOnly: false,
//         secure: false,
//         sameSite: 'lax',
//       })
//     }

//     cartData = await standardizeCartData(req.userId, cartData)

//     res.status(200).send({ message: 'Product data received', cartData })
//   } catch (error) {
//     console.error('Error adding product to cart:', error)
//     res.status(500).send({ message: 'Internal Server Error' })
//   }
// }

// const getCart = async (req, res) => {
//   try {
//     let cartData = []

//     if (req.userId) {
//       cartData = await prisma.cart.findUnique({
//         where: { UserId: req.userId },
//         include: { CartItems: { include: { Product: true } } },
//       })
//     } else {
//       cartData = req.cookies.cart ? JSON.parse(req.cookies.cart) : []
//     }

//     cartData = await standardizeCartData(req.userId, cartData)

//     res.status(200).send({ message: cartData })
//   } catch (error) {
//     console.error('Error getting cart data:', error)
//     res.status(500).send({ message: 'Internal Server Error' })
//   }
// }

// const removeFromCart = async (req, res) => {
//   try {
//     const productId = parseInt(req.params.productId, 10)
//     let cartData = []

//     if (req.userId) {
//       const cart = await prisma.cart.findUnique({
//         where: { UserId: req.userId },
//         include: { CartItems: true },
//       })

//       if (cart) {
//         await prisma.cartItem.deleteMany({
//           where: {
//             CartId: cart.Id,
//             ProductId: productId,
//           },
//         })

//         cartData = await prisma.cart.findUnique({
//           where: { UserId: req.userId },
//           include: { CartItems: { include: { Product: true } } },
//         })
//       } else {
//         res.status(404).send({ message: 'Cart not found' })
//         return
//       }
//     } else {
//       cartData = req.cookies.cart ? JSON.parse(req.cookies.cart) : []

//       if (!Array.isArray(cartData)) {
//         cartData = []
//       }

//       const updatedCartData = cartData.filter((item) => item.Id !== productId)

//       res.cookie('cart', JSON.stringify(updatedCartData), {
//         httpOnly: false,
//         secure: false,
//         sameSite: 'lax',
//       })

//       cartData = updatedCartData
//     }

//     cartData = await standardizeCartData(req.userId, cartData)

//     res.status(200).send({ message: 'Product removed from cart', cartData })
//   } catch (error) {
//     console.error('Error removing product from cart:', error)
//     res.status(500).send({ message: 'Internal Server Error' })
//   }
// }

// const standardizeCartData = async (userId, cartData) => {
//   let standardizedCartData = []

//   if (userId) {
//     standardizedCartData = cartData.CartItems.map((item) => ({
//       ...item.Product,
//       cartInfo: {
//         Amount: item.Amount,
//         Id: item.Id,
//         CartId: item.CartId,
//       },
//     }))
//   } else {
//     for (const productData of cartData) {
//       const product = await prisma.product.findUnique({
//         where: { Id: productData.Id },
//       })

//       if (product) {
//         const availableQuantity = product.Quantity
//         if (productData.Amount > availableQuantity) {
//           productData.Amount = availableQuantity
//         }

//         standardizedCartData.push({
//           ...product,
//           cartInfo: {
//             Amount: productData.Amount,
//             Id: productData.Id,
//             CartId: null,
//           },
//         })
//       }
//     }
//   }

//   return standardizedCartData
// }

// module.exports = {
//   addToCart,
//   getCart,
//   removeFromCart,
// }
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const addToCart = async (req, res) => {
  try {
    const { Id, Amount, isUpdate } = req.body
    console.log('Received product data:', { Id, Amount, isUpdate })

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
    } else {
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

      res.cookie('cart', JSON.stringify(cartData), {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
      })
    }

    cartData = await standardizeCartData(req.userId, cartData)

    res.status(200).send({ message: 'Product data received', cartData })
  } catch (error) {
    console.error('Error adding product to cart:', error)
    res.status(500).send({ message: 'Internal Server Error' })
  }
}

const getCart = async (req, res) => {
  try {
    let cartData = []

    if (req.userId) {
      cartData = await prisma.cart.findUnique({
        where: { UserId: req.userId },
        include: { CartItems: { include: { Product: true } } },
      })
    } else {
      cartData = req.cookies.cart ? JSON.parse(req.cookies.cart) : []
    }

    cartData = await standardizeCartData(req.userId, cartData)

    res.status(200).send({ message: cartData })
  } catch (error) {
    console.error('Error getting cart data:', error)
    res.status(500).send({ message: 'Internal Server Error' })
  }
}

const removeFromCart = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10)
    let cartData = []

    if (req.userId) {
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
          include: { CartItems: { include: { Product: true } } },
        })
      } else {
        res.status(404).send({ message: 'Cart not found' })
        return
      }
    } else {
      cartData = req.cookies.cart ? JSON.parse(req.cookies.cart) : []

      if (!Array.isArray(cartData)) {
        cartData = []
      }

      const updatedCartData = cartData.filter((item) => item.Id !== productId)

      res.cookie('cart', JSON.stringify(updatedCartData), {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
      })

      cartData = updatedCartData
    }

    cartData = await standardizeCartData(req.userId, cartData)

    res.status(200).send({ message: 'Product removed from cart', cartData })
  } catch (error) {
    console.error('Error removing product from cart:', error)
    res.status(500).send({ message: 'Internal Server Error' })
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

const getDeliveryMethods = async (req, res) => {
  try {
    const deliveryMethods = await prisma.deliveryMethod.findMany()
    res.status(200).send({ deliveryMethods })
  } catch (error) {
    console.error('Error fetching delivery methods:', error)
    res.status(500).send({ message: 'Internal Server Error' })
  }
}

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
}
