export interface DocumentEntity {
  id: string;
  userId: string;
  name: string;
  originalName: string;
  path: string;
  mimeType: string;
  size: number;
  extractedText: string | null;
  summary: string | null;
  createdAt: Date;
  updatedAt: Date;
}
