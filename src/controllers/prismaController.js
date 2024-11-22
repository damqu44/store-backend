const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const testPrismaConnection = async (req, res) => {
  try {
    await prisma.$connect()
    res.status(200).json({ message: "Połączono z bazą danych!" })
  } catch (error) {
    res
      .status(500)
      .json({ message: "Nie udało się połączyć z bazą danych!", error: error })
  } finally {
    await prisma.$disconnect()
  }
}

module.exports = {
  testPrismaConnection,
}
