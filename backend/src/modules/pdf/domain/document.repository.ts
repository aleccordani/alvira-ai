import { DocumentEntity } from "./document.entity.js";

export type CreateDocumentInput = {
  userId: string;
  name: string;
  originalName: string;
  path: string;
  mimeType: string;
  size: number;
  extractedText?: string | null;
  summary?: string | null;
};

export interface DocumentRepository {
  create(data: CreateDocumentInput): Promise<DocumentEntity>;

  findByUserId(userId: string): Promise<DocumentEntity[]>;

  findById(id: string): Promise<DocumentEntity | null>;

  update(document: DocumentEntity): Promise<DocumentEntity>;
  updateExtractedText(id: string, extractedText: string): Promise<void>;
  updateSummary(id: string, summary: string): Promise<void>;
  
  delete(id: string): Promise<void>;
}
