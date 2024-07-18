-- CreateTable
CREATE TABLE `DeliveryMethod` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,
    `Quantity` INTEGER NOT NULL,
    `ImageLink` VARCHAR(191) NOT NULL,
    `Price` DECIMAL(65, 30) NOT NULL,
    `Description` VARCHAR(191) NULL,
    `categoryId` INTEGER NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product_DeliveryMethods` (
    `ProductId` INTEGER NOT NULL,
    `DeliveryMethodId` INTEGER NOT NULL,

    PRIMARY KEY (`ProductId`, `DeliveryMethodId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`Id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product_DeliveryMethods` ADD CONSTRAINT `Product_DeliveryMethods_ProductId_fkey` FOREIGN KEY (`ProductId`) REFERENCES `Product`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product_DeliveryMethods` ADD CONSTRAINT `Product_DeliveryMethods_DeliveryMethodId_fkey` FOREIGN KEY (`DeliveryMethodId`) REFERENCES `DeliveryMethod`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
