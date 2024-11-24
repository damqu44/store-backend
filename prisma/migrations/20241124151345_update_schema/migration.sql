/*
  Warnings:

  - You are about to drop the column `AdressDeliveryId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the `adress_delivery` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `AddressDeliveryId` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `adress_delivery` DROP FOREIGN KEY `adress_delivery_UserId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `order_AdressDeliveryId_fkey`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `AdressDeliveryId`,
    ADD COLUMN `AddressDeliveryId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `adress_delivery`;

-- CreateTable
CREATE TABLE `address_delivery` (
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

-- AddForeignKey
ALTER TABLE `address_delivery` ADD CONSTRAINT `address_delivery_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `user`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_AddressDeliveryId_fkey` FOREIGN KEY (`AddressDeliveryId`) REFERENCES `address_delivery`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
