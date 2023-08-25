import { StreamingTextResponse, LangChainStream, type Message } from "ai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { AIChatMessage, HumanChatMessage } from "langchain/schema";
import { env } from "@/env.mjs";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { type NextApiRequest, type NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

export const runtime = "edge";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const request = (await (req as unknown as Request).json()) as {
    messages: Message[];
    title: string;
    diff: string;
    files: string;
  };
  const messages = request.messages;
  const title = request.title;
  const diff = request.diff;
  const files = request.files;

  const { stream, handlers } = LangChainStream();

  const template =
    "You are a brilliant and meticulous software engineer. We are working on an issue called {title}. These are the files: {files}. This is the diff: {diff}";
  const systemMessagePrompt =
    SystemMessagePromptTemplate.fromTemplate(template);

  console.log(systemMessagePrompt);
  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    systemMessagePrompt,
  ]);

  const formattedChatPrompt = await chatPrompt.formatMessages({
    title,
    diff,
    files,
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
