export interface ChatProvider {
  chat(prompt: string): Promise<string>;
}
