import { type NextPage } from "next";

import { Button } from "@/features/shared/components/ui/button";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home: NextPage = () => {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) void router.push("/home");
  }, [isSignedIn, router]);

  return (
    <>
      <div className="flex h-screen items-center justify-center px-4 text-center sm:px-8 ">
        <div className="mt-6 flex max-w-[770px] flex-col items-center justify-center gap-2 text-center">
          <h1 className="text-xl font-semibold leading-tight tracking-tighter">
            Contribute to open source together.
          </h1>
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/apply">
              <Button size="sm" variant="secondary" className="text-xs">
                Apply for beta
              </Button>
            </Link>
            <a
              href="https://github.com/montocode/monto"
              target="_blank"
              className="mt-8 font-mono text-xs text-slate-500 hover:underline"
            >
              GitHub repo
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
