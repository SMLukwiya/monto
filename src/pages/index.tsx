import { type NextPage } from "next";

import { Button } from "@/features/shared/components/ui/button";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex h-screen items-center justify-center px-4 text-center sm:px-8 ">
        <div className="mt-6 flex max-w-[770px] flex-col items-center justify-center gap-2 text-center">
          <h1 className="text-xl font-semibold leading-tight tracking-tighter">
            Contribute to open source together.
          </h1>
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/home">
              <Button size="sm" variant="secondary" className="text-xs">
                Join beta
              </Button>
            </Link>
            <a
              href="https://github.com/montocode/monto"
              target="_blank"
              className="mt-8 font-mono text-xs text-slate-500"
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
