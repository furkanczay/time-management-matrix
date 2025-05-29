-- DropForeignKey
ALTER TABLE "Subtask" DROP CONSTRAINT "Subtask_parentId_fkey";

-- AddForeignKey
ALTER TABLE "Subtask" ADD CONSTRAINT "Subtask_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
