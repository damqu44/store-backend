const { PrismaClient, Prisma } = require("@prisma/client")
const prisma = new PrismaClient()

const getProducts = async (req, res) => {
  const { content } = req.query

  try {
    if (!content) {
      return res.status(400).send("Content not provided")
    }

    const products = await prisma.product.findMany({
      where: {
        Quantity: {
          gt: 0,
        },
        OR: [
          { Name: { contains: content.toLowerCase() } },
          { Description: { contains: content.toLowerCase() } },
        ],
      },
      include: {
        Category: true,
        Images: true,
      },
      orderBy: [{ Name: "desc" }, { Description: "desc" }],
    })

    res.json(products)
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
}

module.exports = {
  getProducts,
}
