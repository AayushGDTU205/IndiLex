/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `LawyerReq` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userID]` on the table `UserReq` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[laywerID]` on the table `UserReq` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LawyerReq_userId_key" ON "LawyerReq"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserReq_userID_key" ON "UserReq"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "UserReq_laywerID_key" ON "UserReq"("laywerID");
