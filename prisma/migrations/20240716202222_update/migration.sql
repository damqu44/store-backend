/*
  Warnings:

  - You are about to drop the column `city` on the `adressdelivery` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `adressdelivery` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `adressdelivery` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `adressdelivery` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.
  - Added the required column `City` to the `AdressDelivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Street` to the `AdressDelivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserId` to the `AdressDelivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ZipCode` to the `AdressDelivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `adressdelivery` DROP FOREIGN KEY `AdressDelivery_userId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_categoryId_fkey`;

-- AlterTable
ALTER TABLE `adressdelivery` DROP COLUMN `city`,
    DROP COLUMN `street`,
    DROP COLUMN `userId`,
    DROP COLUMN `zipCode`,
    ADD COLUMN `City` VARCHAR(191) NOT NULL,
    ADD COLUMN `Street` VARCHAR(191) NOT NULL,
    ADD COLUMN `UserId` INTEGER NOT NULL,
    ADD COLUMN `ZipCode` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `categoryId`,
    ADD COLUMN `CategoryId` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `password`,
    ADD COLUMN `Password` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_CategoryId_fkey` FOREIGN KEY (`CategoryId`) REFERENCES `Category`(`Id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdressDelivery` ADD CONSTRAINT `AdressDelivery_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
