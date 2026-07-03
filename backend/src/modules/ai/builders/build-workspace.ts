export function buildWorkspacePrompt(profilePrompt: string, workspace: string) {
  return `
${profilePrompt}

Current Workspace:
${workspace}

Always stay inside this workspace unless the user explicitly changes it.
`;
}
