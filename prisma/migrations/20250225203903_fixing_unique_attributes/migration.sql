/*
  Warnings:

  - A unique constraint covering the columns `[name,color,userId]` on the table `tags` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "tags_color_key";

-- DropIndex
DROP INDEX "tags_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_color_userId_key" ON "tags"("name", "color", "userId");
