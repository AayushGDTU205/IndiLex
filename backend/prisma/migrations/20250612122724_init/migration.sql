/*
  Warnings:

  - Added the required column `status` to the `ReviewedUserReq` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReviewedUserReq" ADD COLUMN     "status" TEXT NOT NULL;
