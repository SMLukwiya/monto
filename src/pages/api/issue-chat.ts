import { StreamingTextResponse, LangChainStream, type Message } from "ai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { AIChatMessage, HumanChatMessage } from "langchain/schema";
import { env } from "@/env.mjs";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { getAuth } from "@clerk/nextjs/server";
import { type NextApiRequest, type NextApiResponse } from "next";

export const runtime = "edge";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const request = (await (req as unknown as Request).json()) as {
    messages: Message[];
    title: string;
    description: string;
  };
  const messages = request.messages;
  const title = request.title;
  const description = request.description;

  const { stream, handlers } = LangChainStream();

  const template =
    "You are a brilliant and meticulous software engineer. We are working on an issue called {title}. This is the description: {description}.";
  const systemMessagePrompt =
    SystemMessagePromptTemplate.fromTemplate(template);

  console.log(systemMessagePrompt);
  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    systemMessagePrompt,
  ]);

  const formattedChatPrompt = await chatPrompt.formatMessages({
    title,
    description,
  });

  const llm = new ChatOpenAI({
    openAIApiKey: env.OPENAI_API_KEY,
    modelName: "gpt-3.5-turbo-16k", // gpt-3.5-turbo-16k", // "gpt-4", //
    streaming: true,
  });

  llm
    .call(
      [
        ...formattedChatPrompt,
        ...messages.map((m) =>
          m.role == "user"
            ? new HumanChatMessage(m.content)
            : new AIChatMessage(m.content)
        ),
      ],
      {},
      [handlers]
    )
    .catch(console.error);

  return new StreamingTextResponse(stream);
}
