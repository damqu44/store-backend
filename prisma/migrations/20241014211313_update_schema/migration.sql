/*
  Warnings:

  - You are about to drop the column `ImageLink` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `ImageLink`;

-- CreateTable
CREATE TABLE `Image` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Url` VARCHAR(191) NOT NULL,
    `ProductId` INTEGER NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_ProductId_fkey` FOREIGN KEY (`ProductId`) REFERENCES `Product`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
