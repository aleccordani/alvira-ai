import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Lazy initializer for GoogleGenAI to prevent crash if key is missing on startup
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is missing. AI routes will run in simulation mode.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// -------------------------------------------------------------
// AI API Endpoints
// -------------------------------------------------------------

// General AI Chat Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, image } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Simulation mode fallback if API Key is not set yet
      return res.json({
        text: `[Simulation Mode] Thank you for your question: "${message}". Connect your GEMINI_API_KEY in Settings > Secrets to enable live Gemini 3.5 AI reasoning! Here is a helpful general response: Alvira AI is fully loaded and ready to streamline your workflows. Let me know what we are building next!`,
        simulated: true,
      });
    }

    // Format history for gemini contents
    // Gemini 2.x+ expects contents structure: Array of { role: string, parts: Array<{ text: string }> }
    const contents: any[] = [];

    if (history && Array.isArray(history)) {
      history.forEach((turn: { role: string; text: string }) => {
        contents.push({
          role: turn.role === "user" ? "user" : "model",
          parts: [{ text: turn.text }],
        });
      });
    }

    // Append the current user prompt
    const parts: any[] = [{ text: message }];

    if (image && image.data && image.mimeType) {
      parts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: image.data,
        },
      });
    }

    contents.push({
      role: "user",
      parts: parts,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: "You are Alvira AI, an elegant and professional AI productivity assistant. Your response should be insightful, clear, and perfectly formatted in markdown with clear spacing. Use bullet points or code snippets where appropriate.",
      },
    });

    return res.json({ text: response.text || "No response received.", simulated: false });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    return res.status(500).json({
      error: "Failed to generate AI response.",
      details: error.message,
    });
  }
});

// Specialized Tool: Code Studio Generator
app.post("/api/generate-code", async (req, res) => {
  try {
    const { prompt, language } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        code: `// Simulation Mode: Connect GEMINI_API_KEY for live generation
function greetAlvira() {
  console.log("Welcome to Alvira AI Code Studio!");
  console.log("Input prompt: ${prompt}");
  return {
    status: "ready",
    editor: "Advanced Neural Code Studio"
  };
}`,
        explanation: "This is a simulated code snippet. Add your GEMINI_API_KEY in the Secrets panel to generate real functional code files.",
        simulated: true,
      });
    }

    const systemInstruction = `You are an expert programming assistant in the Alvira Advanced Neural Code Studio. Generate clean, modular, and optimized code for the language: ${language || "TypeScript"}. Output a JSON object containing the fields "code" (the raw code block) and "explanation" (a brief guide explaining the design choices and implementation). Do not output markdown wrapping around the JSON, return ONLY the raw JSON object.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate code for this task: ${prompt}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);
    return res.json({
      code: data.code || "",
      explanation: data.explanation || "",
      simulated: false,
    });
  } catch (error: any) {
    console.error("Code Generation Error:", error);
    return res.status(500).json({
      error: "Failed to generate code.",
      details: error.message,
    });
  }
});

// Specialized Tool: Doc Summarizer
app.post("/api/summarize", async (req, res) => {
  try {
    const { text, length } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required to summarize." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        summary: `• Alvira AI is configured in Simulation Mode.\n• The text provided contains ${text.length} characters.\n• A secure server-side connection to Gemini 3.5-flash will instantly summarize long articles, documents, and logs when a GEMINI_API_KEY is supplied.`,
        simulated: true,
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Please summarize the following text. Target summary length: ${length || "medium"}.\n\nText:\n${text}`,
      config: {
        systemInstruction: "You are an elite research summarizer. Deliver a highly polished, structural, bulleted summary of the provided text, capturing all critical insights, conclusions, and data metrics. Keep it high-density and easy to skim.",
      },
    });

    return res.json({ summary: response.text || "Failed to generate summary.", simulated: false });
  } catch (error: any) {
    console.error("Summarization Error:", error);
    return res.status(500).json({
      error: "Failed to summarize text.",
      details: error.message,
    });
  }
});

// Specialized Tool: LingoFlow Translator
app.post("/api/translate", async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        translatedText: `[Simulated Translation to ${targetLanguage || "Spanish"}]: ${text}`,
        simulated: true,
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Translate the following text into ${targetLanguage || "Spanish"}.\n\nText:\n${text}`,
      config: {
        systemInstruction: "You are a professional literary and technical translator. Translate the text accurately, keeping the original tone, context, and structural formatting. Return ONLY the translated text without commentary.",
      },
    });

    return res.json({ translatedText: response.text || "Failed to translate.", simulated: false });
  } catch (error: any) {
    console.error("Translation Error:", error);
    return res.status(500).json({
      error: "Failed to translate text.",
      details: error.message,
    });
  }
});

// -------------------------------------------------------------
// Front-End Static & Hot Middleware Routing
// -------------------------------------------------------------

async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Alvira AI running on http://localhost:${PORT}`);
  });
}

startServer();
