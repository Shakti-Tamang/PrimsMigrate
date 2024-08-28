/*
  Warnings:

  - You are about to drop the `attendence` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[attendanceId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `status` to the `homework` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `homework` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "attendence" DROP CONSTRAINT "attendence_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "attendanceId" TEXT;

-- AlterTable
ALTER TABLE "homework" ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "topic" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "attendence";

-- CreateTable
CREATE TABLE "attendance" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_attendanceId_key" ON "User"("attendanceId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "attendance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homework" ADD CONSTRAINT "homework_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
