import { z } from "zod";

export const explainCodeSchema = z.object({
  language: z
    .enum([
      "javascript",
      "typescript",
      "python",
      "java",
      "php",
      "go",
      "csharp",
      "cpp",
      "sql",
      "html",
      "css",
      "other",
    ])
    .default("other"),

  code: z.string().min(10, "Code must be at least 10 characters"),
});
