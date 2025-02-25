/*
  Warnings:

  - A unique constraint covering the columns `[color]` on the table `tags` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tags_color_key" ON "tags"("color");
