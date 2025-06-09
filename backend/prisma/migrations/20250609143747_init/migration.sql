-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "formStatus" TEXT NOT NULL DEFAULT 'not filled',
    "isLawyer" BOOLEAN NOT NULL DEFAULT false,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lawyer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "barLicenseNumber" TEXT NOT NULL,
    "Specialization" TEXT NOT NULL,
    "court" TEXT NOT NULL,
    "practiceSince" INTEGER NOT NULL,

    CONSTRAINT "Lawyer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LawyerReq" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "barLicenseNumber" TEXT NOT NULL,
    "Specialization" TEXT NOT NULL,
    "court" TEXT NOT NULL,
    "practiceSince" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "LawyerReq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserReq" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contact" INTEGER NOT NULL,
    "caseDesc" TEXT NOT NULL,
    "userID" INTEGER NOT NULL,
    "laywerID" INTEGER NOT NULL,

    CONSTRAINT "UserReq_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Lawyer_email_key" ON "Lawyer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LawyerReq_email_key" ON "LawyerReq"("email");
