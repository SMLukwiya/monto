import { Layout } from "@/features/shared/components/layout/layout";
import { Button } from "@/features/shared/components/ui/button";
import { api } from "@/server/lib/api";
import { Loader2, Square } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Welcome({ onSubmit }: { onSubmit: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: users } = api.user.list.useQuery();

  async function handleOnSubmit() {
    setIsLoading(true);
    // wait for 1 second and show the loader
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSubmit();
    setIsLoading(false);
  }

  return (
    <>
      <Layout>
        <div className="max-w-[660px]">
          <h1 className="scroll-m-20 pb-2 pt-2 text-2xl font-bold tracking-tight">
            {getGreetingBasedOnTime()} and welcome to Monto 👋
          </h1>
          <p className="pb-3">
            Happy to have you aboard! We’re a community of ambitious developers.
            We challenge ourselves to become better every day, support one
            another, and build a track record of great open source
            contributions.
          </p>
        </div>
        <div
          className="grid-cols-auto-fill grid gap-2 pt-4"
          style={{ gridTemplateColumns: "repeat(auto-fill, 40px)" }}
        >
          {(users || []).map((user) => (
            <div key={user.id}>
              <Image
                src={user.profileImageUrl}
                alt="profile image"
                width={60}
                height={60}
                className="rounded-full border border-slate-200"
              />
            </div>
          ))}
        </div>
        <div className="max-w-[660px] pt-8">
          <h2 className="scroll-m-20 pb-2 text-lg font-bold tracking-tight">
            Onboarding checklist
          </h2>
          <p className="pb-3">
            Our first mission is to get you up and running. By completing these
            steps, you’ll learn a lot about our community and how we work.
          </p>
          <div className="flex items-center gap-2 pb-2">
            <Square className="h-4 w-4" /> <div>Join the community</div>
          </div>
          <div className="flex items-center gap-2 pb-2">
            <Square className="h-4 w-4" />{" "}
            <div>Find an interesting issue and give it a go</div>
          </div>
          <div className="flex items-center gap-2 pb-2">
            <Square className="h-4 w-4" />{" "}
            <div>Submit a PR and have it merged</div>
          </div>
          <div className="flex items-center gap-2 pb-2">
            <Square className="h-4 w-4" /> <div>Celebrate 🎉</div>
          </div>
        </div>
        <div className="max-w-[660px] pt-8">
          <h2 className="scroll-m-20 pb-2 text-lg font-bold tracking-tight">
            Step 1: Join the community
          </h2>
          <p className="pb-3">
            To get things started, join our Discord server (
            <a
              href="https://discord.gg/WghCteUrEv"
              target="_blank"
              className="text-slate-500 hover:underline"
            >
              invite link
            </a>
            ) and say hello to everyone by making a post in the #random channel.
            You can use this template or draft your own message 🙂
          </p>
          <p className="rounded-lg bg-slate-100 p-8 text-sm text-slate-800">
            Hi everyone, I’m [Your Name] from [Your Location], and I’m happy to
            be part of the community! 🙌
            <br />
            <br />
            Here’s a little more about me:
            <br />
            <br />- <strong>Quick Introduction:</strong> [Something interesting
            about yourself or what you do]
            <br />- <strong>Hobbies or Activities:</strong> [What you enjoy
            doing in your free time]
            <br />- <strong>Fun Fact:</strong> [Something quirky or unexpected
            about you]
            <br />- <strong>If I Could Eat One Meal Forever:</strong> [Your
            go-to meal]
            <br />- <strong>Favorite Media:</strong> [A book, movie, TV show,
            game, podcast, or song you love, and why it resonates with you]
          </p>
        </div>
        <Button onClick={() => void handleOnSubmit()} className="mt-6">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Mark as done
        </Button>
      </Layout>
    </>
  );
}

function getGreetingBasedOnTime() {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return "Good morning";
  } else if (currentHour >= 12 && currentHour < 14) {
    return "Good day";
  } else if (currentHour >= 14 && currentHour < 18) {
    return "Good afternoon";
  } else if (currentHour >= 18 && currentHour < 22) {
    return "Good evening";
  } else {
    return "Good night";
  }
}
