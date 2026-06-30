import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Alvira AI, a smart AI assistant for business productivity.",
        },
        {
          role: "user",
          content: body.message,
        },
      ],
    });

    return Response.json({
      message: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        message: "Something went wrong.",
      },
      {
        status: 500,
      },
    );
  }
}
