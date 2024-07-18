const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

const getProducts = async (req, res) => {
  const { content } = req.query

  try {
    if (!content) {
      return res.status(400).send('Content not provided')
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { Name: { contains: content.toLowerCase() } },
          { Description: { contains: content.toLowerCase() } },
        ],
      },
      include: {
        Category: true,
      },
      orderBy: [{ Name: 'desc' }, { Description: 'desc' }],
    })

    res.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

module.exports = {
  getProducts,
}
