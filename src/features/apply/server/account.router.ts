import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { z } from "zod";

export const accountRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        discordUsername: z.string(),
        pullRequestUrl: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const account = await prisma.account.create({
        data: {
          discordUsername: input.discordUsername,
          pullRequestUrl: input.pullRequestUrl,
        },
      });

      return account;
    }),
});
