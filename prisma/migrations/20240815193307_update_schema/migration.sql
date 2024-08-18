/*
  Warnings:

  - Added the required column `LastName` to the `AdressDelivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Name` to the `AdressDelivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DeliveryMethodId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `InvoiceDataId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `adressdelivery` ADD COLUMN `LastName` VARCHAR(191) NOT NULL,
    ADD COLUMN `Name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `Comment` VARCHAR(191) NULL,
    ADD COLUMN `DeliveryMethodId` INTEGER NOT NULL,
    ADD COLUMN `DiscountCode` VARCHAR(191) NULL,
    ADD COLUMN `InvoiceDataId` INTEGER NOT NULL,
    ADD COLUMN `IsPaid` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `BirthDate` DATETIME(3) NULL,
    ADD COLUMN `Gender` ENUM('MAN', 'FEMALE') NULL,
    ADD COLUMN `PrimaryAddressDeliveryId` INTEGER NULL,
    ADD COLUMN `PrimaryInvoiceDataId` INTEGER NULL;

-- CreateTable
CREATE TABLE `InvoiceData` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,
    `Street` VARCHAR(191) NOT NULL,
    `City` VARCHAR(191) NOT NULL,
    `ZipCode` VARCHAR(191) NOT NULL,
    `Nip` VARCHAR(191) NULL,
    `UserId` INTEGER NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InvoiceData` ADD CONSTRAINT `InvoiceData_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_InvoiceDataId_fkey` FOREIGN KEY (`InvoiceDataId`) REFERENCES `InvoiceData`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_DeliveryMethodId_fkey` FOREIGN KEY (`DeliveryMethodId`) REFERENCES `DeliveryMethod`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
