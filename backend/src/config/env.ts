import "dotenv/config";
import { z } from "zod";

const booleanFromString = z
  .enum(["true", "false"])
  .default("false")
  .transform((value) => value === "true");

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),

    PORT: z.coerce.number().int().positive().default(5000),

    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

    FRONTEND_URL: z
      .string()
      .url("FRONTEND_URL must be a valid URL")
      .default("http://localhost:5173"),

    BACKEND_URL: z
      .string()
      .url("BACKEND_URL must be a valid URL")
      .default("http://localhost:5000"),

    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),

    JWT_EXPIRES_IN: z.string().default("7d"),

    BETTER_AUTH_SECRET: z
      .string()
      .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),

    BETTER_AUTH_URL: z.string().url("BETTER_AUTH_URL must be a valid URL"),

    GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),

    GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),

    OPENAI_API_KEY: z.string().optional(),

    OPENAI_MODEL: z.string().default("gpt-4.1-mini"),

    AI_MOCK: booleanFromString,

    MIDTRANS_SERVER_KEY: z.string().min(1, "MIDTRANS_SERVER_KEY is required"),

    MIDTRANS_CLIENT_KEY: z.string().min(1, "MIDTRANS_CLIENT_KEY is required"),

    MIDTRANS_IS_PRODUCTION: booleanFromString,
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV === "production" && !env.OPENAI_API_KEY && !env.AI_MOCK) {
      ctx.addIssue({
        code: "custom",
        path: ["OPENAI_API_KEY"],
        message:
          "OPENAI_API_KEY is required in production when AI_MOCK is false",
      });
    }

    if (
      env.NODE_ENV === "production" &&
      env.FRONTEND_URL.includes("localhost")
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["FRONTEND_URL"],
        message: "FRONTEND_URL cannot use localhost in production",
      });
    }

    if (
      env.NODE_ENV === "production" &&
      env.BACKEND_URL.includes("localhost")
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["BACKEND_URL"],
        message: "BACKEND_URL cannot use localhost in production",
      });
    }
  });

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(parsedEnv.error.format(), null, 2),
  );

  process.exit(1);
}

export const env = parsedEnv.data;
