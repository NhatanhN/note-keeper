-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "dateCreated" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dateUploaded" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "uploaderID" TEXT NOT NULL,
    "noteID" INTEGER NOT NULL,
    CONSTRAINT "Image_uploaderID_fkey" FOREIGN KEY ("uploaderID") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Image_noteID_fkey" FOREIGN KEY ("noteID") REFERENCES "Note" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Note" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dateUploaded" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedOn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "uploaderID" TEXT NOT NULL,
    CONSTRAINT "Note_uploaderID_fkey" FOREIGN KEY ("uploaderID") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_password_key" ON "User"("password");
