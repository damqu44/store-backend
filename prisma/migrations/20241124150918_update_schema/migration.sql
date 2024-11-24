/*
  Warnings:

  - You are about to drop the `AdressDelivery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CartItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DeliveryMethod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Invoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product_DeliveryMethods` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `AdressDelivery` DROP FOREIGN KEY `AdressDelivery_UserId_fkey`;

-- DropForeignKey
ALTER TABLE `Cart` DROP FOREIGN KEY `Cart_UserId_fkey`;

-- DropForeignKey
ALTER TABLE `CartItem` DROP FOREIGN KEY `CartItem_CartId_fkey`;

-- DropForeignKey
ALTER TABLE `CartItem` DROP FOREIGN KEY `CartItem_ProductId_fkey`;

-- DropForeignKey
ALTER TABLE `Image` DROP FOREIGN KEY `Image_ProductId_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_AdressDeliveryId_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_DeliveryMethodId_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_InvoiceId_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_UserId_fkey`;

-- DropForeignKey
ALTER TABLE `OrderItem` DROP FOREIGN KEY `OrderItem_OrderId_fkey`;

-- DropForeignKey
ALTER TABLE `OrderItem` DROP FOREIGN KEY `OrderItem_ProductId_fkey`;

-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_CategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `Product_DeliveryMethods` DROP FOREIGN KEY `Product_DeliveryMethods_DeliveryMethodId_fkey`;

-- DropForeignKey
ALTER TABLE `Product_DeliveryMethods` DROP FOREIGN KEY `Product_DeliveryMethods_ProductId_fkey`;

-- DropTable
DROP TABLE `AdressDelivery`;

-- DropTable
DROP TABLE `Cart`;

-- DropTable
DROP TABLE `CartItem`;

-- DropTable
DROP TABLE `Category`;

-- DropTable
DROP TABLE `DeliveryMethod`;

-- DropTable
DROP TABLE `Image`;

-- DropTable
DROP TABLE `Invoice`;

-- DropTable
DROP TABLE `Order`;

-- DropTable
DROP TABLE `OrderItem`;

-- DropTable
DROP TABLE `Product`;

-- DropTable
DROP TABLE `Product_DeliveryMethods`;

-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `delivery_method` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,
    `Price` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,
    `Quantity` INTEGER NOT NULL,
    `Price` DECIMAL(65, 30) NOT NULL,
    `Description` VARCHAR(3000) NOT NULL,
    `CategoryId` INTEGER NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `image` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Url` VARCHAR(191) NOT NULL,
    `ProductId` INTEGER NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_delivery_methods` (
    `ProductId` INTEGER NOT NULL,
    `DeliveryMethodId` INTEGER NOT NULL,

    PRIMARY KEY (`ProductId`, `DeliveryMethodId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,
    `LastName` VARCHAR(191) NOT NULL,
    `Email` VARCHAR(191) NOT NULL,
    `Telephone` INTEGER NOT NULL,
    `Password` VARCHAR(191) NOT NULL,
    `Gender` ENUM('MAN', 'FEMALE') NULL,
    `BirthDate` DATETIME(3) NULL,
    `PrimaryAddressDeliveryId` INTEGER NULL,

    UNIQUE INDEX `user_Email_key`(`Email`),
    UNIQUE INDEX `user_Telephone_key`(`Telephone`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cart` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `UserId` INTEGER NOT NULL,

    UNIQUE INDEX `cart_UserId_key`(`UserId`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cart_item` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `CartId` INTEGER NOT NULL,
    `ProductId` INTEGER NOT NULL,
    `Amount` INTEGER NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `adress_delivery` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,
    `LastName` VARCHAR(191) NOT NULL,
    `Street` VARCHAR(191) NOT NULL,
    `City` VARCHAR(191) NOT NULL,
    `ZipCode` VARCHAR(191) NOT NULL,
    `Telephone` INTEGER NOT NULL,
    `UserId` INTEGER NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invoice` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,
    `Street` VARCHAR(191) NULL,
    `City` VARCHAR(191) NULL,
    `ZipCode` VARCHAR(191) NULL,
    `Nip` VARCHAR(191) NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `UserId` INTEGER NOT NULL,
    `AdressDeliveryId` INTEGER NOT NULL,
    `InvoiceId` INTEGER NULL,
    `OrderDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `TotalPrice` DECIMAL(65, 30) NOT NULL,
    `DeliveryMethodId` INTEGER NOT NULL,
    `Status` ENUM('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `IsPaid` BOOLEAN NOT NULL DEFAULT false,
    `Comment` VARCHAR(191) NULL,
    `DiscountCode` VARCHAR(191) NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_item` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `OrderId` INTEGER NOT NULL,
    `ProductId` INTEGER NOT NULL,
    `Quantity` INTEGER NOT NULL,
    `Price` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_CategoryId_fkey` FOREIGN KEY (`CategoryId`) REFERENCES `category`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `image` ADD CONSTRAINT `image_ProductId_fkey` FOREIGN KEY (`ProductId`) REFERENCES `product`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_delivery_methods` ADD CONSTRAINT `product_delivery_methods_ProductId_fkey` FOREIGN KEY (`ProductId`) REFERENCES `product`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_delivery_methods` ADD CONSTRAINT `product_delivery_methods_DeliveryMethodId_fkey` FOREIGN KEY (`DeliveryMethodId`) REFERENCES `delivery_method`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `cart_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `user`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_item` ADD CONSTRAINT `cart_item_CartId_fkey` FOREIGN KEY (`CartId`) REFERENCES `cart`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_item` ADD CONSTRAINT `cart_item_ProductId_fkey` FOREIGN KEY (`ProductId`) REFERENCES `product`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `adress_delivery` ADD CONSTRAINT `adress_delivery_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `user`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `user`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_AdressDeliveryId_fkey` FOREIGN KEY (`AdressDeliveryId`) REFERENCES `adress_delivery`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_InvoiceId_fkey` FOREIGN KEY (`InvoiceId`) REFERENCES `invoice`(`Id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_DeliveryMethodId_fkey` FOREIGN KEY (`DeliveryMethodId`) REFERENCES `delivery_method`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_item` ADD CONSTRAINT `order_item_OrderId_fkey` FOREIGN KEY (`OrderId`) REFERENCES `order`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_item` ADD CONSTRAINT `order_item_ProductId_fkey` FOREIGN KEY (`ProductId`) REFERENCES `product`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
