const { PrismaClient, Prisma } = require("@prisma/client")
const prisma = new PrismaClient()

const getProducts = async (req, res) => {
  const { content, category, page = 1, limit = 10 } = req.query
  const whereClause = {
    Quantity: {
      gt: 0,
    },
  }

  if (content) {
    whereClause.OR = [
      { Name: { contains: content.toLowerCase() } },
      { Description: { contains: content.toLowerCase() } },
    ]
  }

  if (category) {
    whereClause.Category = {
      Name: category,
    }
  }

  try {
    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        Category: true,
        Images: true,
      },
      orderBy: [{ Name: "desc" }, { Description: "desc" }],
      skip: (page - 1) * limit,
      take: parseInt(limit),
    })

    const totalProductCount = await prisma.product.count({ where: whereClause })

    res.json({ products, totalProductCount })
  } catch (error) {
    console.error("Error fetching products:", error)
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message })
  }
}

module.exports = {
  getProducts,
}
