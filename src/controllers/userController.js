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

const editPersonalData = async (req, res) => {
  try {
    const { name, lastName, birthDate, gender } = req.body

    if (!name || !lastName) {
      return res.status(400).json({ error: 'Name and LastName are required' })
    }

    const updateData = {
      Name: name,
      LastName: lastName,
    }

    if (birthDate) {
      updateData.BirthDate = new Date(birthDate)
      if (isNaN(updateData.BirthDate.getTime())) {
        return res.status(400).json({ error: 'Invalid birth date format' })
      }
    }

    if (gender) {
      if (!['MAN', 'FEMALE'].includes(gender)) {
        return res.status(400).json({ error: 'Invalid gender' })
      }
      updateData.Gender = gender
    }

    const updatedUser = await prisma.user.update({
      where: { Id: req.userId },
      data: updateData,
    })

    res.json(updatedUser)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const editMail = async (req, res) => {}

const editTelephoneNumber = async (req, res) => {}

const editPassword = async (req, res) => {}

const addAddressDelivery = async (req, res) => {}

const editAddressDelivery = async (req, res) => {}

const deleteAddressDelivery = async (req, res) => {}

const changePrimaryAddressDelivery = async (req, res) => {}

const addInvoiceData = async (req, res) => {}

const editInvoiceData = async (req, res) => {}

const deleteInvoiceData = async (req, res) => {}

const changePrimaryInvoiceData = async (req, res) => {}

module.exports = {
  getInfo,
  editPersonalData,
}
