export function buildPrompt(
  identity: string,
  safety: string,
  markdown: string,
  output: string,
  planner: string,
  profile: string,
) {
  return [identity, safety, markdown, output, planner, profile].join("\n\n");
}
