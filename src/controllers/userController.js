const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getInfo = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { Id: req.userId },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    console.error('Error fetching user info:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

module.exports = {
  getInfo,
}
