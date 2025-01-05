-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "href" TEXT,
    "description" TEXT,
    "technologies" TEXT[],
    "links" TEXT[],
    "image" TEXT,
    "thumbnail" TEXT,
    "featuredVideo" TEXT,
    "video" TEXT,
    "featured" BOOLEAN,
    "context" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
