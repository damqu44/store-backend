/*
  Warnings:

  - Made the column `Description` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `CategoryId` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_CategoryId_fkey`;

-- AlterTable
ALTER TABLE `product` MODIFY `Description` VARCHAR(3000) NOT NULL,
    MODIFY `CategoryId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_CategoryId_fkey` FOREIGN KEY (`CategoryId`) REFERENCES `Category`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
