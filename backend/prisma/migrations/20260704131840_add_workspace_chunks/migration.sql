-- CreateTable
CREATE TABLE "WorkspaceChunk" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "workspaceFileId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" JSONB NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkspaceChunk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkspaceChunk_workspaceId_idx" ON "WorkspaceChunk"("workspaceId");

-- CreateIndex
CREATE INDEX "WorkspaceChunk_workspaceFileId_idx" ON "WorkspaceChunk"("workspaceFileId");

-- AddForeignKey
ALTER TABLE "WorkspaceChunk" ADD CONSTRAINT "WorkspaceChunk_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceChunk" ADD CONSTRAINT "WorkspaceChunk_workspaceFileId_fkey" FOREIGN KEY ("workspaceFileId") REFERENCES "WorkspaceFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
