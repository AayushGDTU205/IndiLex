-- DropIndex
DROP INDEX "UserReq_laywerID_key";

-- DropIndex
DROP INDEX "UserReq_userID_key";

-- CreateTable
CREATE TABLE "ReviewedUserReq" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contact" INTEGER NOT NULL,
    "caseDesc" TEXT NOT NULL,
    "userID" INTEGER NOT NULL,
    "laywerID" INTEGER NOT NULL,

    CONSTRAINT "ReviewedUserReq_pkey" PRIMARY KEY ("id")
);
