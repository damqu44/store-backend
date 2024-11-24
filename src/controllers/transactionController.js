const { PrismaClient } = require("@prisma/client")
const { connect } = require("../routes/productRoutes")
const prisma = new PrismaClient()

const getTransaction = async (req, res) => {
  const { transactionData } = req.body

  if (!transactionData.addressDeliveryId) {
    res.status(500).json({ error: "Address delivery was not provided" })
  }

  if (!transactionData.products || transactionData.products.length < 1) {
    res.status(500).json({ error: "products was not provided" })
  }

  if (!transactionData.deliveryMethodId) {
    res.status(500).json({ error: "Delivery method was not provided" })
  }

  if (!transactionData.paymentMethod) {
    res.status(500).json({ error: "Payment method was not provided" })
  }

  if (transactionData.invoiceData && !transactionData.invoiceData.fullName) {
    res.status(500).json({ error: "Invoice data was not provided" })
  }

  try {
    const productIds = transactionData.products.map((product) => product.id)
    console.log(productIds)
    // Pobierz szczegóły produktów z bazy danych
    const products = await prisma.product.findMany({
      where: { Id: { in: productIds } },
    })

    let totalPrice = 0
    const orderItemsData = []

    // Sprawdź ilość i oblicz całkowitą cenę
    for (const product of transactionData.products) {
      const dbProduct = products.find((p) => p.Id === product.id)
      if (!dbProduct) {
        return res
          .status(500)
          .json({ error: `Product with ID ${product.id} not found` })
      }
      if (dbProduct.Quantity < product.amount) {
        return res.status(500).json({
          error: `Insufficient stock for product with ID ${product.id}`,
        })
      }
      totalPrice += dbProduct.Price * product.Amount

      orderItemsData.push({
        ProductId: dbProduct.Id,
        Quantity: product.Amount,
        Price: dbProduct.Price,
      })
    }

    let invoiceId = transactionData.invoiceData?.id

    if (transactionData.invoiceData && !invoiceId) {
      const invoice = await prisma.invoice.create({
        data: {
          Name: transactionData.invoiceData.fullName,
          Street: transactionData.invoiceData.street,
          City: transactionData.invoiceData.city,
          ZipCode: transactionData.invoiceData.telephone,
          Nip: transactionData.invoiceData.nip,
        },
      })
      invoiceId = invoice.Id
    } else {
      invoiceId = undefined
    }

    const newOrder = await prisma.order.create({
      data: {
        User: {
          connect: { Id: req.userId },
        },
        OrderItems: {
          create: orderItemsData,
        },
        TotalPrice: totalPrice,
        Comment: transactionData.comment,
        DiscountCode: transactionData.DiscountCode,
        AddressDelivery: {
          connect: { Id: transactionData.addressDeliveryId },
        },
        ...(invoiceId && {
          Invoice: {
            connect: { Id: invoiceId },
          },
        }),
        DeliveryMethod: {
          connect: { Id: transactionData.deliveryMethodId },
        },
      },
    })

    for (const product of transactionData.products) {
      await prisma.product.update({
        where: { Id: product.id },
        data: { Quantity: { decrement: product.Amount } },
      })
    }

    await prisma.cart_item.deleteMany({
      where: {
        Cart: {
          UserId: req.userId,
        },
      },
    })

    await prisma.cart.delete({
      where: {
        UserId: req.userId,
      },
    })

    res
      .status(200)
      .json({ message: "Order created successfully", order: newOrder })
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" })
  }
}

const getProducts = async (req, res) => {
  const { products } = req.body

  if (!products || !Array.isArray(products)) {
    return res.status(400).json({ error: "Invalid cart data" })
  }

  try {
    const verifiedProducts = await verifyProducts(products)

    if (verifiedProducts.length > 0) {
      res.status(200).json(verifiedProducts)
    } else {
      res.status(400).json({ error: "No valid products found" })
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" })
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
      Images: {
        select: {
          Url: true,
        },
        take: 1,
      },
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
    return {
      Id: product.Id,
      Name: product.Name,
      Price: product.Price,
      ImageUrl: product.Images.length > 0 ? product.Images[0].Url : "",
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

  return verifiedProducts.filter((p) => p.IsAvailable)
}

module.exports = {
  getProducts,
  getTransaction,
}
