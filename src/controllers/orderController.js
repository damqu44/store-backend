const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { UserId: req.userId },
      include: {
        OrderItems: {
          include: {
            Product: true,
          },
        },
      },
    })

    console.log(orders)
    res.status(200).json(orders)
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: 'Internal server error' })
  }
}

module.exports = {
  getOrders,
}
