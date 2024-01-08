/*
  Warnings:

  - You are about to drop the column `quantity` on the `Product` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `_UserToVoucher` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_UserToVoucher` DROP FOREIGN KEY `_UserToVoucher_A_fkey`;

-- DropForeignKey
ALTER TABLE `_UserToVoucher` DROP FOREIGN KEY `_UserToVoucher_B_fkey`;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `quantity`,
    MODIFY `price` INTEGER NOT NULL;

-- DropTable
DROP TABLE `_UserToVoucher`;
