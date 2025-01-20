-- CreateTable
CREATE TABLE "Post" (
    "title" VARCHAR(192) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_title_key" ON "Post"("title");
