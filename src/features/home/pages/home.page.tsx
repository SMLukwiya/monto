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
          <p>
            Happy to have you aboard! First things first, let us quickly
            introduce ourselves. So who are we and what do we do?
          </p>
        </div>
        <div className="pt-4">
          {(users || []).map((user) => (
            <div key={user.id} className="pb-3 pr-3">
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
