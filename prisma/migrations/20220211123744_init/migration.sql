-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(50) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `drive` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `path` VARCHAR(200) NOT NULL,
    `totalCapacity` INTEGER UNSIGNED NOT NULL,
    `usingCapacity` INTEGER UNSIGNED NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `drive_path_key`(`path`),
    UNIQUE INDEX `drive_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `drive` ADD CONSTRAINT `drive_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
