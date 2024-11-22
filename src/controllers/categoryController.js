const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany()
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error })
  }
}

module.exports = {
  getCategories,
}
