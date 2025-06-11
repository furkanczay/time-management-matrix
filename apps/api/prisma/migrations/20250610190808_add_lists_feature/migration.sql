-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "listId" TEXT;

-- CreateTable
CREATE TABLE "list" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT DEFAULT '#3b82f6',
    "order" INTEGER NOT NULL DEFAULT 0,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "list_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "list" ADD CONSTRAINT "list_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_listId_fkey" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE SET NULL ON UPDATE CASCADE;
