import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { clerkClient } from "@clerk/nextjs";
import { Octokit } from "@octokit/rest";
import { z } from "zod";
import { env } from "@/env.mjs";

export const issueRouter = createTRPCRouter({
  show: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const issue = await prisma.issue.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          title: true,
          googleDocUrl: true,
          owner: true,
          repo: true,
          issueNumber: true,
        },
      });

      if (!issue) throw new Error("Issue not found");

      const githubIssue = await octokit().rest.issues.get({
        owner: issue.owner,
        repo: issue.repo,
        issue_number: issue.issueNumber,
      });

      return {
        ...issue,
        body: githubIssue.data.body || "Empty",
      };
    }),
  list: privateProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const limit = input.limit ?? 10;
      const cursor = input.cursor;

      const issues = await prisma.issue.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
      });

      let nextCursor: typeof cursor;
      if (issues.length > limit) {
        const nextItem = issues.pop();
        nextCursor = nextItem?.id;
      }

      const ownerIds = issues
        .map((issue) => issue.userId || "undefined")
        .filter((ownerId) => ownerId !== "undefined");
      const users = await listClerkUsers(ownerIds);

      const issuesWithOwner = issues.map((issue) => {
        const user = users.find((user) => user.id === issue.userId);
        return {
          ...issue,
          user,
        };
      });

      return {
        items: issuesWithOwner,
        nextCursor,
      };
    }),

  create: privateProcedure
    .input(
      z.object({
        url: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const url = input.url;

      // ['https:', '', 'github.com', 'calcom', 'cal.com', 'issues', '10640']
      const splittedUrl = url.split("/");
      const owner = splittedUrl[3];
      const repo = splittedUrl[4];
      const issueNumber = splittedUrl[6];

      if (!owner || !repo || !issueNumber) throw new Error("Invalid URL");

      const githubApi = octokit();

      const githubIssueRequest = githubApi.rest.issues.get({
        owner,
        repo,
        issue_number: parseInt(issueNumber),
      });

      const recentCommitRequest = githubApi.rest.repos.getCommit({
        owner: "monto7926",
        repo,
        ref: "main",
      });

      const [githubIssue, recentCommit] = await Promise.all([
        githubIssueRequest,
        recentCommitRequest,
      ]);

      const branchNameSlug = githubIssue.data.title
        .toLowerCase()
        .replace(/\s+/g, "-");
      const randomNumber = Math.floor(Math.random() * 1000);

      const githubBranch = await githubApi.rest.git.createRef({
        owner: "monto7926",
        repo,
        ref: `refs/heads/${branchNameSlug}-${randomNumber}`,
        sha: recentCommit.data.sha,
      });

      const branchName = githubBranch.data.ref.replace("refs/heads/", "");
      const issue = await prisma.issue.create({
        data: {
          title: githubIssue.data.title,
          owner,
          repo,
          issueNumber: parseInt(issueNumber),
          branchName,
          userId: ctx.userId,
        },
      });

      await prisma.preReview.create({
        data: {
          owner: "monto7926",
          repo,
          head: branchName,
          base: "main",
          userId: ctx.userId,
          title: githubIssue.data.title,
          issueId: issue.id,
        },
      });

      return issue;
    }),

  delete: privateProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const issue = await prisma.issue.findUnique({
        where: {
          id: input,
        },
        select: {
          id: true,
          userId: true,
        },
      });

      if (!issue) throw new Error("Issue not found");

      if (issue.userId !== ctx.userId) throw new Error("Not authorized");

      await prisma.issue.delete({
        where: {
          id: input,
        },
      });

      return true;
    }),
});

async function listClerkUsers(userIds: string[]) {
  const users = await clerkClient.users.getUserList({
    userId: userIds,
  });

  return users.map((user) => ({
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  }));
}

function octokit() {
  return new Octokit({
    auth: `token ${env.MONTO_GITHUB_TOKEN}`,
  });
}
