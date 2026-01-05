/*
  Warnings:

  - You are about to drop the column `courseReference` on the `questions` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_questions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quizId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "explanation" TEXT,
    "reference" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "questions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_questions" ("createdAt", "explanation", "id", "order", "questionText", "quizId", "updatedAt") SELECT "createdAt", "explanation", "id", "order", "questionText", "quizId", "updatedAt" FROM "questions";
DROP TABLE "questions";
ALTER TABLE "new_questions" RENAME TO "questions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
