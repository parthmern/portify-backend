-- CreateTable
CREATE TABLE "Works" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "company" TEXT,
    "href" TEXT,
    "location" TEXT,
    "title" TEXT NOT NULL,
    "logoUrl" TEXT,
    "start" TEXT,
    "end" TEXT,
    "description" TEXT NOT NULL,

    CONSTRAINT "Works_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Works_userId_key" ON "Works"("userId");

-- AddForeignKey
ALTER TABLE "Works" ADD CONSTRAINT "Works_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
