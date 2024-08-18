/*
  Warnings:

  - Added the required column `Price` to the `DeliveryMethod` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `deliverymethod` ADD COLUMN `Price` DECIMAL(65, 30) NOT NULL;
