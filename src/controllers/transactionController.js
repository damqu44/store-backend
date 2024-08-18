const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getProducts = async (req, res) => {
  const { products } = req.body

  if (!products || !Array.isArray(products)) {
    return res.status(400).json({ error: 'Invalid cart data' })
  }

  try {
    const verifiedProducts = await verifyProducts(products)

    if (verifiedProducts.length > 0) {
      res.status(200).json(verifiedProducts)
    } else {
      res.status(400).json({ error: 'No valid products found' })
    }
  } catch (error) {
    console.error('Error verifying products:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const verifyProducts = async (products) => {
  const productIds = products.map((p) => p.id).filter((id) => id !== undefined)

  const foundProducts = await prisma.product.findMany({
    where: {
      Id: { in: productIds },
    },
    select: {
      Id: true,
      Name: true,
      Quantity: true,
      Price: true,
      ImageLink: true,
      DeliveryMethods: {
        select: {
          DeliveryMethod: {
            select: {
              Id: true,
              Name: true,
              Price: true,
            },
          },
        },
      },
    },
  })

  const verifiedProducts = foundProducts.map((product) => {
    const cartProduct = products.find((p) => p.id === product.Id)
    console.log(cartProduct)
    return {
      Id: product.Id,
      Name: product.Name,
      Price: product.Price,
      ImageLink: product.ImageLink,
      RequestedAmount: cartProduct ? cartProduct.amount : 0,
      AvailableAmount: product.Quantity,
      IsAvailable: cartProduct ? product.Quantity >= cartProduct.amount : false,
      DeliveryMethods: product.DeliveryMethods.map((dm) => ({
        Id: dm.DeliveryMethod.Id,
        Name: dm.DeliveryMethod.Name,
        Price: dm.DeliveryMethod.Price,
      })),
    }
  })
  console.log(verifiedProducts)

  return verifiedProducts.filter((p) => p.IsAvailable)
}

module.exports = {
  getProducts,
}
