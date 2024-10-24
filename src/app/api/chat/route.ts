import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 30;

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const systemMessage = {
    role: "system",
    content: `You are a personal AI health assistant that will be given personnal information. Your First message will include data about the user. Advise them on what next steps to take and what conditions they may have. Ask any further questions and help them with any of their questions.`,
  };

  const { messages } = await req.json();

  // Inject system message as the first message in the array
  const updatedMessages = [systemMessage, ...messages];

  const result = await streamText({
    model: groq("llama-3.1-8b-instant"), //llama-3.1-8b-instant
    messages: updatedMessages,
  });

  return result.toDataStreamResponse();
}
