export class ChunkService {
  split(text: string, chunkSize = 800, overlap = 150): string[] {
    const chunks: string[] = [];

    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);

      const chunk = text.slice(start, end).trim();

      if (chunk.length > 0) {
        chunks.push(chunk);
      }

      if (end >= text.length) break;

      start = end - overlap;
    }

    return chunks;
  }
}
