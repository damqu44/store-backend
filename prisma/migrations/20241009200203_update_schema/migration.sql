-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_InvoiceId_fkey`;

-- AlterTable
ALTER TABLE `order` MODIFY `InvoiceId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_InvoiceId_fkey` FOREIGN KEY (`InvoiceId`) REFERENCES `Invoice`(`Id`) ON DELETE SET NULL ON UPDATE CASCADE;
