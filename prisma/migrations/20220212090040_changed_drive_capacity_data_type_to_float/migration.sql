-- AlterTable
ALTER TABLE `drive` MODIFY `totalCapacity` DOUBLE NOT NULL,
    MODIFY `usingCapacity` DOUBLE NOT NULL DEFAULT 0;
