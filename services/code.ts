import api from "./api";

export type CodeLanguage =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "php"
  | "go"
  | "csharp"
  | "cpp"
  | "sql"
  | "html"
  | "css"
  | "other";

export type CodeExplanationSection = {
  title: string;
  content: string;
};

export type ExplainCodeResult = {
  summary: string;
  explanation: CodeExplanationSection[];
  complexity: string;
  bestPractices: string[];
  suggestions: string[];
};

export async function explainCode(payload: {
  language: CodeLanguage;
  code: string;
}) {
  const response = await api.post("/tools/code/explain", payload);
  return response.data.data as ExplainCodeResult;
}
