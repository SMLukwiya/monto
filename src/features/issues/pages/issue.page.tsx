import { Layout } from "@/features/shared/components/layout/layout";
import { api } from "@/server/lib/api";
import { LoadingPage } from "@/features/shared/components/ui/loading";
import { Button } from "@/features/shared/components/ui/button";
import { ArrowLeft, ExternalLink, MoreHorizontal } from "lucide-react";
import { ActionsTopbar } from "@/features/shared/components/layout/actions-topbar";
import Link from "next/link";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { ActionsDropdown } from "@/features/issues/components/actions-dropdown";
import { Switch } from "@/features/shared/components/ui/switch";
import { useState } from "react";
import AiChat from "@/features/issues/components/ai-chat";

export default function IssuePage({ id }: { id: string }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { data: issue } = api.issue.show.useQuery({ id });

  if (!issue)
    return (
      <Layout noPadding fullScreen fullScreenOnMobile>
        <LoadingPage />
      </Layout>
    );

  return (
    <>
      <Layout noPadding fullScreen fullScreenOnMobile>
        <div>
          <ActionsTopbar>
            <Link href={`/issues/#${issue.id}`}>
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className="cursor-pointer text-xs font-semibold"
                  onClick={() => setIsChatOpen((prev) => !prev)}
                >
                  AI Assistant
                </div>
                <Switch
                  checked={isChatOpen}
                  onCheckedChange={() => {
                    setIsChatOpen((prev) => !prev);
                    return true;
                  }}
                />
              </div>
              <ActionsDropdown issueId={issue.id}>
                <Button variant="ghost" asChild>
                  <div>
                    <MoreHorizontal className="h-4 w-4" />
                  </div>
                </Button>
              </ActionsDropdown>
            </div>
          </ActionsTopbar>
          <div className="flex">
            <div
              className={`overflow-auto px-4 py-4 md:overflow-visible md:px-8 ${
                isChatOpen ? "w-1/2 md:pr-3" : ""
              }`}
            >
              <div className="flex items-center gap-3 pb-4">
                <h1 className="text-2xl font-bold">{issue.title}</h1>
                <a
                  href={`https://github.com/${`${issue.owner}/${issue.repo}/issues/${issue.issueNumber}`}`}
                  target="_blank"
                >
                  <ExternalLink className="h-5 w-5 text-slate-300 hover:text-slate-200" />
                </a>
              </div>
              <ReactMarkdown className="markdown-wrapper">
                {issue.body}
              </ReactMarkdown>
            </div>
            {isChatOpen && (
              <div className="w-1/2 overflow-auto border-l-2 border-slate-100 bg-slate-50 px-2 md:overflow-visible">
                <div
                  className="sticky h-full flex-grow overflow-y-auto px-1 pb-2"
                  style={{ height: "calc(100vh - 60px)", top: "60px" }}
                >
                  <AiChat title={issue.title} description={issue.body} />
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
