const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const getCategories = async (req, res) => {
  try {
    try {
      await prisma.$connect() // Próba połączenia
      res.status(200).json({ message: "Połączono z bazą danych!" })
    } catch (error) {
      res.status(500).json({
        message: "Nie udało się połączyć z bazą danych!",
        error: error,
      })
    } finally {
      await prisma.$disconnect() // Ważne: zamykanie połączenia
    }
    const categories = await prisma.category.findMany()
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error })
  }
}

module.exports = {
  getCategories,
}
