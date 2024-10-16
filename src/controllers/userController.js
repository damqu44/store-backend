const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const bcrypt = require("bcrypt")

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
        Password: false,
      },
    })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
}

const getAddresses = async (req, res) => {
  try {
    const addresses = await prisma.adressDelivery.findMany({
      where: { UserId: req.userId },
    })

    if (!addresses) {
      return res.status(404).json({ error: "Addresses not found" })
    }

    res.status(200).json(addresses)
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" })
  }
}

const editPersonalData = async (req, res) => {
  try {
    const { name, lastName, birthDate, gender } = req.body

    if (!name || !lastName) {
      return res.status(400).json({
        error: "Name and LastName are required",
        message: "Fields cannot be empty",
      })
    }

    const updateData = {
      Name: name,
      LastName: lastName,
    }

    if (birthDate) {
      updateData.BirthDate = new Date(birthDate)
      if (isNaN(updateData.BirthDate.getTime())) {
        return res.status(400).json({
          error: "Invalid birth date format",
          message:
            "Ensure the date is in dd-mm-yyyy format and contains only numbers",
        })
      }
    }

    if (gender) {
      if (!["MAN", "FEMALE"].includes(gender)) {
        return res.status(400).json({
          error: "Invalid gender",
          message: "Ensure you have chosen one of the listed genders",
        })
      }
      updateData.Gender = gender
    }

    const updatedUser = await prisma.user.update({
      where: { Id: req.userId },
      data: updateData,
    })

    res.json(updatedUser)
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" })
  }
}

const getAddressDeliveryById = async (req, res) => {
  try {
    const { addressId } = req.body

    if (!addressId) {
      return res.status(400).json({
        error: "Address Delivery Id are required",
        message: "Values cannot be null",
      })
    }

    const addressDelivery = await prisma.adressDelivery.findUnique({
      where: { Id: addressId },
    })
    res.json(addressDelivery)
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" })
  }
}

const editEmail = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: "Email are required" })
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const currentEmail = await prisma.user.findUnique({
      where: { Id: req.userId },
      select: { Email: true },
    })

    if (!emailPattern.test(email)) {
      return res.status(400).json({ error: "Invalid email address" })
    } else if (email === currentEmail.Email) {
      return res.status(400).json({
        error: "The new email address cannot be the same as the current one",
      })
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        Email: email,
      },
    })

    if (existingUser) {
      return res.status(400).json({
        error: "Email already in use",
        message:
          "The provided email address is already associated with another account",
      })
    }

    await prisma.user.update({
      where: { Id: req.userId },
      data: { Email: email },
    })

    res.status(200).json({ message: "Email changed successfully" })
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" })
  }
}

const editTelephoneNumber = async (req, res) => {
  try {
    const { telephone } = req.body

    if (!telephone) {
      return res.status(400).json({ error: "Telephone number are required" })
    }

    const phonePattern = /^\d{9}$/
    if (!phonePattern.test(telephone)) {
      return res.status(400).json({
        error: "Invalid Telephone Number",
        message: "The phone number must contain 9 pieces",
      })
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        Telephone: parseInt(telephone),
      },
    })

    if (existingUser) {
      return res.status(400).json({
        error: "Telephone number already in use",
        message:
          "The provided telephone number is already associated with another account",
      })
    }

    await prisma.user.update({
      where: { Id: req.userId },
      data: { Telephone: parseInt(telephone) },
    })

    res.status(200).json({ message: "Telephone Number changed successfully" })
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" })
  }
}

const editPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body

    const user = await prisma.user.findUnique({
      where: { Id: req.userId },
      select: { Password: true },
    })

    const isPasswordValid = await bcrypt.compare(oldPassword, user.Password)

    if (!isPasswordValid) {
      return res.status(400).json({
        error: "Invalid old password",
        message: "The old password provided is incorrect",
      })
    }

    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/
    if (!passwordPattern.test(newPassword)) {
      return res.status(400).json({
        error: "Invalid password format",
        message:
          "Min. 8 characters • uppercase letter • lowercase letter • number",
      })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { Id: req.userId },
      data: { Password: hashedNewPassword },
    })

    res.status(200).json({
      message: "Password changed successfully",
    })
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" })
  }
}

const addAddressDelivery = async (req, res) => {
  try {
    const { name, lastName, street, city, zipCode, telephone } = req.body

    if (!name || !lastName || !street || !city || !zipCode || !telephone) {
      return res.status(400).json({ error: "All fields are required" })
    }

    const existingAddressCount = await prisma.adressDelivery.count({
      where: { UserId: req.userId },
    })

    if (existingAddressCount >= 5) {
      return res.status(400).json({
        error: "Address limit exceeded",
        message: "You can only have up to 5 delivery addresses",
      })
    }

    const zipCodePattern = /^\d{2}-\d{3}$/
    if (!zipCodePattern.test(zipCode)) {
      return res.status(400).json({
        error: "Invalid Zip Code format",
        message: "Zip code format should be xx-xxx",
      })
    }

    const phonePattern = /^\d{9}$/
    if (!phonePattern.test(telephone)) {
      return {
        status: 400,
        error: "Invalid Telephone Number",
        message: "The phone number must contain 9 pieces",
      }
    }

    await prisma.adressDelivery.create({
      data: {
        Name: name,
        LastName: lastName,
        Street: street,
        City: city,
        ZipCode: zipCode,
        Telephone: parseInt(telephone),
        UserId: req.userId,
      },
    })

    res.status(200).json({ message: "Address delivery added successfully" })
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" })
  }
}

const editAddressDelivery = async (req, res) => {
  try {
    const { addressId, name, lastName, street, city, zipCode, telephone } =
      req.body

    if (
      !addressId ||
      !name ||
      !lastName ||
      !street ||
      !city ||
      !zipCode ||
      !telephone
    ) {
      return res.status(400).json({ error: "All fields are required" })
    }

    const zipCodePattern = /^\d{2}-\d{3}$/
    if (!zipCodePattern.test(zipCode)) {
      return res.status(400).json({
        error: "Invalid Zip Code format",
        message: "Zip code format should be xx-xxx",
      })
    }

    const phonePattern = /^\d{9}$/
    if (!phonePattern.test(telephone)) {
      return {
        status: 400,
        error: "Invalid Telephone Number",
        message: "The phone number must contain 9 pieces",
      }
    }

    await prisma.adressDelivery.update({
      where: { Id: addressId },
      data: {
        Name: name,
        LastName: lastName,
        Street: street,
        City: city,
        ZipCode: zipCode,
        Telephone: parseInt(telephone),
      },
    })

    res.status(200).json({ message: "Address delivery updated successfully" })
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" })
  }
}

const deleteAddressDelivery = async (req, res) => {
  try {
    const { addressDeliveryId } = req.body

    if (!addressDeliveryId) {
      return res.status(400).json({ error: "Address delivery Id is required" })
    }

    const user = await prisma.user.findUnique({
      where: { Id: req.userId },
      select: { PrimaryAddressDeliveryId: true },
    })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (addressDeliveryId === user.PrimaryAddressDeliveryId) {
      await prisma.user.update({
        where: { Id: req.userId },
        data: { PrimaryAddressDeliveryId: null },
      })
    }

    const addressDelivery = await prisma.adressDelivery.findUnique({
      where: { Id: addressDeliveryId },
    })

    if (!addressDelivery) {
      return res.status(404).json({ error: "Address delivery not found" })
    }

    await prisma.adressDelivery.delete({
      where: { Id: addressDeliveryId },
    })

    res.status(200).json({ message: "Address delivery removed successfully" })
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" })
  }
}

const editPrimaryAddressDelivery = async (req, res) => {
  try {
    const { addressDeliveryId } = req.body

    if (!addressDeliveryId) {
      return res.status(400).json({ error: "Address delivery Id is required" })
    }

    await prisma.user.update({
      where: { Id: req.userId },
      data: { PrimaryAddressDeliveryId: addressDeliveryId },
    })

    res
      .status(200)
      .json({ message: "Primary address delivery changed successfully" })
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" })
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
  deleteAddressDelivery,
  editAddressDelivery,
  editPrimaryAddressDelivery,
  getAddressDeliveryById,
}
