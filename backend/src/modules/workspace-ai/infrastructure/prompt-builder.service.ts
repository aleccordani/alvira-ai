export class PromptBuilderService {
  build(question: string, contexts: string[]): string {
    return `
You are ALVIRA AI.

You MUST answer ONLY using the provided context.

If the answer is not contained in the context, say:

"I couldn't find that information in this workspace."

Context:

${contexts.join("\n\n----------------\n\n")}

Question:

${question}
`;
  }
}
