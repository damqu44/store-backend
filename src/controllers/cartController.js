const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const addToCart = async (req, res) => {
  try {
    const { Id, Amount, isUpdate } = req.body
    console.log('Received product data:', Id)

    let cartData = req.cookies.cart ? JSON.parse(req.cookies.cart) : []

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

    res.status(200).send({ message: 'Product data received', Id, Amount })
  } catch (error) {
    console.error('Error adding product to cart:', error)
    res.status(500).send({ message: 'Internal Server Error' })
  }
}

const getCart = async (req, res) => {
  try {
    let cartData = req.cookies.cart ? JSON.parse(req.cookies.cart) : []
    let detailedCartData = []

    for (const productData of cartData) {
      const product = await prisma.product.findUnique({
        where: { Id: productData.Id },
      })

      if (product) {
        const availableQuantity = product.Quantity
        if (productData.Amount > availableQuantity) {
          productData.Amount = availableQuantity
        }

        detailedCartData.push({
          ...product,
          Amount: productData.Amount,
        })
      }
    }

    res.cookie('cart', JSON.stringify(detailedCartData), {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
    })

    res.status(200).send({ message: detailedCartData })
  } catch (error) {
    console.error('Error getting cart data:', error)
    res.status(500).send({ message: 'Internal Server Error' })
  }
}

const removeFromCart = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10)

    let cartData = req.cookies.cart ? JSON.parse(req.cookies.cart) : []

    if (!Array.isArray(cartData)) {
      cartData = []
    }

    const updatedCartData = cartData.filter((item) => item.Id !== productId)

    res.cookie('cart', JSON.stringify(updatedCartData), {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
    })

    res.status(200).send({ message: 'Product removed from cart', productId })
  } catch (error) {
    console.error('Error removing product from cart:', error)
    res.status(500).send({ message: error })
  }
}

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
}
