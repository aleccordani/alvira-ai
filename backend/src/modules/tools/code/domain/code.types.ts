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

export interface ExplainCodeInput {
  language: CodeLanguage;
  code: string;
}

export interface CodeExplanationSection {
  title: string;
  content: string;
}

export interface ExplainCodeResult {
  summary: string;
  explanation: CodeExplanationSection[];
  complexity: string;
  bestPractices: string[];
  suggestions: string[];
}
