import { Layout } from "@/features/shared/components/layout/layout";
import { api } from "@/server/lib/api";
import Image from "next/image";

export default function HomePage() {
  const { data: users } = api.user.list.useQuery();

  return (
    <>
      <Layout>
        <div className="max-w-[660px]">
          <h1 className="scroll-m-20 pb-2 text-2xl font-bold tracking-tight">
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
          style={{ gridTemplateColumns: "repeat(auto-fill, 70px)" }}
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
