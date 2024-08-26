const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')

const getInfo = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { Id: req.userId },
      select: {
        Id: true,
        Email: true,
        Name: true,
        LastName: true,
        BirthDate: true,
        Gender: true,
        Telephone: true,
        PrimaryAddressDeliveryId: true,
        PrimaryInvoiceDataId: true,
        Password: false,
      },
    })

    authorizeUser(req.userId)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json(user)
  } catch (error) {
    console.error('Error fetching user info:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const getAddresses = async (req, res) => {
  try {
    authorizeUser(req.userId)

    const addresses = await prisma.adressDelivery.findMany({
      where: { UserId: req.userId },
    })

    if (!addresses) {
      return res.status(404).json({ error: 'Addresses not found' })
    }

    res.status(200).json(addresses)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const editPersonalData = async (req, res) => {
  try {
    const { name, lastName, birthDate, gender } = req.body

    authorizeUser(req.userId)

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
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const editEmail = async (req, res) => {
  try {
    const { email } = req.body

    authorizeUser(req.userId)

    if (!email) {
      return res.status(400).json({ error: 'Email are required' })
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    console.log('Received email:', email)

    const currentEmail = await prisma.user.findUnique({
      where: { Id: req.userId },
      select: { Email: true },
    })
    console.error(email, currentEmail.Email)

    if (!emailPattern.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' })
    } else if (email === currentEmail.Email) {
      return res.status(400).json({
        error: 'The new email address cannot be the same as the current one',
      })
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        Email: email,
      },
    })

    if (existingUser) {
      return res.status(400).json({
        error: 'Email already in use',
        message:
          'The provided email address is already associated with another account',
      })
    }

    await prisma.user.update({
      where: { Id: req.userId },
      data: { Email: email },
    })

    res.status(200).json({ message: 'Email changed successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const editTelephoneNumber = async (req, res) => {
  try {
    const { telephone } = req.body

    authorizeUser(req.userId)

    if (!telephone) {
      return res.status(400).json({ error: 'Telephone number are required' })
    }

    const phonePattern = /^\d{9}$/
    if (!phonePattern.test(telephone)) {
      return res.status(400).json({
        error: 'Invalid Telephone Number',
        message: 'The phone number must contain 9 pieces',
      })
    }
    console.log(telephone, 'i can see this log(its ok)')

    const existingUser = await prisma.user.findFirst({
      where: {
        Telephone: parseInt(telephone),
      },
    })

    if (existingUser) {
      return res.status(400).json({
        error: 'Telephone number already in use',
        message:
          'The provided telephone number is already associated with another account',
      })
    }

    await prisma.user.update({
      where: { Id: req.userId },
      data: { Telephone: parseInt(telephone) },
    })

    res.status(200).json({ message: 'Telephone Number changed successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const editPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body

    authorizeUser(req.userId)

    const user = await prisma.user.findUnique({
      where: { Id: req.userId },
      select: { Password: true },
    })

    const isPasswordValid = await bcrypt.compare(oldPassword, user.Password)

    if (!isPasswordValid) {
      return res.status(400).json({
        error: 'Invalid old password',
        message: 'The old password provided is incorrect',
      })
    }

    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/
    if (!passwordPattern.test(newPassword)) {
      return res.status(400).json({
        error: 'Invalid password format',
        message:
          'Min. 8 characters • uppercase letter • lowercase letter • number',
      })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { Id: req.userId },
      data: { Password: hashedNewPassword },
    })

    res.status(200).json({
      message: 'Password changed successfully',
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const addAddressDelivery = async (req, res) => {
  try {
    const { name, lastName, street, city, zipCode } = req.body

    authorizeUser(req.userId)

    if (!name || !lastName || !street || !city || !zipCode) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    const existingAddressCount = await prisma.adressDelivery.count({
      where: { UserId: req.userId },
    })

    if (existingAddressCount >= 5) {
      return res.status(400).json({
        error: 'Address limit exceeded',
        message: 'You can only have up to 5 delivery addresses',
      })
    }

    const zipCodePattern = /^\d{2}-\d{3}$/
    if (!zipCodePattern.test(zipCode)) {
      return res.status(400).json({
        error: 'Invalid Zip Code format',
        message: 'Zip code format should be xx-xxx',
      })
    }
    console.log('adding:', name, lastName, street, city, zipCode, req.userId)
    await prisma.adressDelivery.create({
      data: {
        Name: name,
        LastName: lastName,
        Street: street,
        City: city,
        ZipCode: zipCode,
        UserId: req.userId,
      },
    })

    res.status(200).json({ message: 'Address delivery added successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

const editAddressDelivery = async (req, res) => {}

const deleteAddressDelivery = async (req, res) => {}

const changePrimaryAddressDelivery = async (req, res) => {}

const addInvoiceData = async (req, res) => {}

const editInvoiceData = async (req, res) => {}

const deleteInvoiceData = async (req, res) => {}

const changePrimaryInvoiceData = async (req, res) => {}

function authorizeUser(userId) {
  if (!userId) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication credentials were not provided',
    })
  }
}

module.exports = {
  getInfo,
  editPersonalData,
  editEmail,
  editPassword,
  editTelephoneNumber,
  addAddressDelivery,
  getAddresses,
}
