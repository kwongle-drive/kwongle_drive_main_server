/*
  Warnings:

  - You are about to alter the column `totalCapacity` on the `drive` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `BigInt`.
  - You are about to alter the column `usingCapacity` on the `drive` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `BigInt`.

*/
-- AlterTable
ALTER TABLE `drive` MODIFY `totalCapacity` BIGINT NOT NULL,
    MODIFY `usingCapacity` BIGINT NOT NULL DEFAULT 0;
