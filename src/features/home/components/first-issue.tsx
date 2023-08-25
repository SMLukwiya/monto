import { Layout } from "@/features/shared/components/layout/layout";
import { Button } from "@/features/shared/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function FirstIssue({
  onSubmit,
  onGoBack,
}: {
  onSubmit: () => void;
  onGoBack: () => void;
}) {
  return (
    <>
      <Layout>
        <div className="max-w-[660px]">
          <h1 className="scroll-m-20 pb-2 pt-2 text-2xl font-bold tracking-tight">
            Step 2: Find an interesting issue and give it a go
          </h1>
        </div>

        <Button onClick={() => onGoBack()} className="mt-6">
          <ChevronLeft className="mr-1 h-3 w-3" />
          Go back
        </Button>
      </Layout>
    </>
  );
}
