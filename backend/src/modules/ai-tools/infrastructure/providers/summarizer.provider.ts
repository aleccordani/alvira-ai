import { ToolProvider } from "./provider.interface.js";

export class SummarizerProvider implements ToolProvider {
  run(input: string): string {
    const preview = input.length > 300 ? `${input.slice(0, 300)}...` : input;

    return `Summary

Main Idea:
${preview}

Key Takeaways:
- The text contains information that can be simplified.
- The main points should be presented clearly.
- A shorter version helps users understand faster.

Short Summary:
This content explains an idea or information that can be condensed into clear, practical points.`;
  }
}
