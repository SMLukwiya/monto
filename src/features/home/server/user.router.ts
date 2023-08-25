import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { clerkClient } from "@clerk/nextjs";

export const userRouter = createTRPCRouter({
  list: privateProcedure.query(async () => {
    const users = await clerkClient.users.getUserList({});

    return users.map((user) => ({
      id: user.id,
      username: user.username,
      profileImageUrl: user.profileImageUrl,
    }));
  }),
});
