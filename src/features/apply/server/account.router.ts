import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { z } from "zod";
import { env } from "@/env.mjs";
import { Octokit } from "@octokit/rest";
import { TRPCError } from "@trpc/server";

export const accountRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        discordUsername: z.string(),
        pullRequestUrl: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const githubApi = octokit();

      const splittedUrl = input.pullRequestUrl.split("/");
      const owner = splittedUrl[3];
      const repo = splittedUrl[4];
      const pullNumber = splittedUrl[6];

      if (!owner || !repo || !pullNumber) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid Pull Request URL",
        });
      }

      const prResponse = await githubApi.pulls.get({
        owner,
        repo,
        pull_number: parseInt(pullNumber),
      });

      if (!prResponse.data) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pull request not found",
        });
      }

      if (!prResponse.data.merged) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Pull request not merged",
        });
      }

      const repoResponse = await githubApi.repos.get({
        owner,
        repo,
      });

      const starCount = repoResponse.data.stargazers_count;

      if (starCount < 1000) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Repo does not have 1k+ stars",
        });
      }

      const account = await prisma.account.create({
        data: {
          discordUsername: input.discordUsername,
          githubUsername: prResponse.data.user.login,
          pullRequestUrl: input.pullRequestUrl,
        },
      });

      return account;
    }),
});

function octokit() {
  return new Octokit({
    auth: `token ${env.MONTO_GITHUB_TOKEN}`,
  });
}
