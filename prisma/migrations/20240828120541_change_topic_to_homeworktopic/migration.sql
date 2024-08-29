/*
  Warnings:

  - You are about to drop the column `topic` on the `homework` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "homework" DROP COLUMN "topic",
ADD COLUMN     "homeworkTopic" TEXT;
