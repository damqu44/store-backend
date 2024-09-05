/*
  Warnings:

  - You are about to drop the column `InvoiceDataId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `PrimaryInvoiceDataId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `invoicedata` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `Telephone` to the `AdressDelivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `InvoiceId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `invoicedata` DROP FOREIGN KEY `InvoiceData_UserId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_InvoiceDataId_fkey`;

-- AlterTable
ALTER TABLE `adressdelivery` ADD COLUMN `Telephone` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `InvoiceDataId`,
    ADD COLUMN `InvoiceId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `PrimaryInvoiceDataId`;

-- DropTable
DROP TABLE `invoicedata`;

-- CreateTable
CREATE TABLE `Invoice` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,
    `Street` VARCHAR(191) NOT NULL,
    `City` VARCHAR(191) NOT NULL,
    `ZipCode` VARCHAR(191) NOT NULL,
    `Nip` VARCHAR(191) NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_InvoiceId_fkey` FOREIGN KEY (`InvoiceId`) REFERENCES `Invoice`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
