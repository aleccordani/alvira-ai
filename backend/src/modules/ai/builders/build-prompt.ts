export function buildPrompt(...sections: string[]) {
  return sections
    .filter(Boolean)
    .map((section) => section.trim())
    .join("\n\n");
}
