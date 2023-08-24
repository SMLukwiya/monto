import { Layout } from "@/features/shared/components/layout/layout";
import { type RouterOutputs, api } from "@/server/lib/api";
import { Button } from "@/features/shared/components/ui/button";
import { LoadingPage } from "@/features/shared/components/ui/loading";
import { Copy, Loader2 } from "lucide-react";
import Image from "next/image";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { useUser } from "@clerk/clerk-react";
import Link from "next/link";
import { toast } from "@/features/shared/components/ui/use-toast";

export default function ListIssuesPage() {
  const query = api.issue.list.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const issues = query.data?.pages.flatMap((page) => page.items);
  const { user } = useUser();

  return (
    <Layout>
      <div className="flex h-full flex-col gap-2 py-2">
        <div className="flex w-full items-start justify-between"></div>
        <div className="rounded-md bg-slate-100 p-4">
          <h2 className="scroll-m-20 pb-1 text-lg font-bold tracking-tight">
            Ready to work on your next issue?
          </h2>
          <div className="pb-1 text-sm">
            Explore issues from projects like{" "}
            <Link
              href="https://github.com/calcom/cal.com/issues"
              target="_blank"
              className="text-slate-500 hover:underline"
            >
              cal.com
            </Link>
            ,{" "}
            <Link
              href="https://github.com/documenso/documenso/issues"
              target="_blank"
              className="text-slate-500 hover:underline"
            >
              documenso
            </Link>
            ,{" "}
            <Link
              href="https://github.com/formbricks/formbricks"
              target="_blank"
              className="text-slate-500 hover:underline"
            >
              Formbricks
            </Link>
            ,{" "}
            <Link
              href="https://github.com/Infisical/infisical/issues"
              target="_blank"
              className="text-slate-500 hover:underline"
            >
              Infisical
            </Link>
            , and{" "}
            <Link
              href="https://www.ycombinator.com/companies?batch=W24&batch=S23&batch=W23&batch=S22&batch=W22&batch=S21&batch=W21&batch=S20&batch=W20&tags=Open%20Source"
              target="_blank"
              className="text-slate-500 hover:underline"
            >
              others
            </Link>
            . Pick one that sparks your interest, add them to Monto, and start
            coding.
          </div>
          <Link href="/issues/new">
            <Button size="sm" className="mt-2">
              Add issue
            </Button>
          </Link>
        </div>
        <div className="relative h-full space-y-3 pt-3">
          {(!issues || !user) && <LoadingPage />}
          {issues &&
            user &&
            issues.map((issue) => <IssueItem issue={issue} key={issue.id} />)}
          <div className="w-full text-center">
            {query.hasNextPage && (
              <Button
                onClick={() => void query.fetchNextPage().catch(console.error)}
                variant="ghost"
                disabled={query.isFetchingNextPage}
              >
                {query.isFetchingNextPage && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Load more
              </Button>
            )}
          </div>
          <div className="pt-8"></div>
        </div>
      </div>
    </Layout>
  );
}

type Issue = RouterOutputs["issue"]["list"]["items"][number];

const IssueItem = ({ issue: issue }: { issue: Issue }) => {
  return (
    <div
      id={issue.id}
      className="rounded-lg border border-muted"
      key={issue.id}
    >
      <div className="p-4">
        {issue.user?.profileImageUrl && (
          <div className="flex items-center gap-1 pb-2">
            <Image
              src={issue.user.profileImageUrl}
              width={20}
              height={20}
              alt="Profile image"
              className="rounded-full border border-slate-100"
            />
            <div className="text-xs text-slate-600">{issue.user?.username}</div>
          </div>
        )}
        <Link href={`/issues/${issue.id}`}>
          <h4 className="text-md scroll-m-20 font-semibold tracking-tight hover:underline">
            {issue.title}
          </h4>
        </Link>
        <div className="text-sm text-slate-600">
          {issue.owner}/{issue.repo}/issues/
          {issue.issueNumber}
        </div>
        <div className="flex items-center gap-1 pt-2 text-sm text-slate-600">
          <span className="font-mono text-xs">
            {issue.branchName || "No branch"}
          </span>
          <CopyToClipboard
            text={issue.branchName || "No branch"}
            onCopy={() =>
              toast({
                description: "Copied branch to clipboard.",
              })
            }
          >
            <Copy className="h-3 w-3 cursor-pointer text-slate-500 hover:text-slate-400" />
          </CopyToClipboard>
        </div>
      </div>
    </div>
  );
};
