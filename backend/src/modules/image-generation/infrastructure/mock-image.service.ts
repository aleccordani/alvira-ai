import { ImageProvider } from "../domain/image-provider.js";

export class MockImageService implements ImageProvider {
  async generate(prompt: string): Promise<string> {
    return `https://placehold.co/1024x1024/png?text=${encodeURIComponent(prompt.slice(0, 40))}`;
  }
}
