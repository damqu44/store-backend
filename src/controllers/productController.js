const { PrismaClient } = require("@prisma/client")
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
        return res.status(404).json({ error: "Category not found" })
      }
    }

    if (sort === "price_asc") {
      orderBy.Price = "asc"
    } else if (sort === "price_desc") {
      orderBy.Price = "desc"
    } else if (sort === "random") {
      const products = await prisma.product.findMany({
        where: {
          Quantity: {
            gt: 0,
          },
        },
        include: {
          Category: true,
          Images: true,
        },
      })
      return res.status(200).json(products.sort(() => 0.5 - Math.random()))
    }
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
        DeliveryMethods: {
          include: {
            DeliveryMethod: true,
          },
        },
        Images: true,
      },
    })
    if (product) {
      const transformedProduct = {
        ...product,
        DeliveryMethods: product.DeliveryMethods.map((dm) => dm.DeliveryMethod),
      }
      res.status(200).json(transformedProduct)
    } else {
      res.status(404).json({ error: "Product not found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
}

const getProductsByIds = async (req, res) => {
  const { productsIds } = req.body
  console.log(productsIds)

  try {
    const productsData = await prisma.product.findMany({
      where: { Id: { in: productsIds } },
      select: { Id: true, Quantity: true },
    })

    if (productsData) {
      res.status(200).json(productsData)
    } else {
      res.status(404).json({ error: "Products not found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
}

module.exports = {
  getProducts,
  getProductById,
  getProductsByIds,
}
