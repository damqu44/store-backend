const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const getProducts = async (req, res) => {
  try {
    const { sort, category } = req.query
    let orderBy = {}
    let where = {}

    if (category) {
      const categoryResult = await prisma.category.findFirst({
        where: { Name: category },
      })

      if (categoryResult) {
        where.categoryId = categoryResult.Id
      } else {
        return res.status(404).json({ error: 'Category not found' })
      }
    }

    if (sort === 'price_asc') {
      orderBy.Price = 'asc'
    } else if (sort === 'price_desc') {
      orderBy.Price = 'desc'
    } else if (sort === 'random') {
      const products = await prisma.product.findMany({
        where,
        include: {
          Category: true,
        },
      })
      return res.json(products.sort(() => 0.5 - Math.random()))
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        Category: true,
      },
    })

    res.json(products)
  } catch (error) {
    res.status(500).json(error)
  }
}

const getProductById = async (req, res) => {
  const { id } = req.params
  try {
    const product = await prisma.product.findUnique({
      where: { Id: parseInt(id) },
      include: {
        Category: true,
      },
    })
    if (product) {
      res.json(product)
    } else {
      res.status(404).json({ error: 'Product not found' })
    }
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

module.exports = {
  getProducts,
  getProductById,
}
