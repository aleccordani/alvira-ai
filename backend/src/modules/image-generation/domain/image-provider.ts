export interface ImageProvider {
  generate(prompt: string): Promise<string>;
}
