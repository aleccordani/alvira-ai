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

  findById(id: string): Promise<DocumentEntity | null>;

  findByUserId(userId: string): Promise<DocumentEntity[]>;

  update(document: DocumentEntity): Promise<DocumentEntity>;

  delete(id: string): Promise<void>;
}
