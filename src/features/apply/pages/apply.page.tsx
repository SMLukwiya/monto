import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { toast } from "@/features/shared/components/ui/use-toast";
import { useZodForm } from "@/features/shared/hooks/use-zod-form";
import { handlePromise } from "@/features/shared/utils/utils";
import { api } from "@/server/lib/api";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { z } from "zod";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

const formSchema = z.object({
  discordUsername: z.string(),
  pullRequestUrl: z.string().url(),
});

export default function ApplyPage() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  const router = useRouter();
  const ctx = api.useContext();
  const mutation = api.account.create.useMutation({
    onSuccess: async () => {
      setShowConfetti(true);
      await new Promise((resolve) => setTimeout(resolve, 4000));
      await ctx.account.invalidate();
      await router.push("/sign-up");
    },
    onError: (e) => {
      const zodErrorMessage = e.data?.zodError?.fieldErrors.content;
      const errorMessage = (zodErrorMessage && zodErrorMessage[0]) || e.message;
      if (errorMessage) {
        toast({
          variant: "destructive",
          description: errorMessage,
        });
      } else {
        toast({
          variant: "destructive",
          description: "Error! Please try again later.",
        });
      }
    },
  });

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  }, []);

  const form = useZodForm({
    schema: formSchema,
  });

  function saveAccount(data: z.infer<typeof formSchema>) {
    console.log(data);
    return mutation.mutate({
      discordUsername: data.discordUsername,
      pullRequestUrl: data.pullRequestUrl,
    });
  }

  return (
    <>
      {showConfetti && <Confetti width={windowWidth} height={windowHeight} />}
      <div className="flex h-screen items-center justify-center p-2">
        <div className="mt-6 flex w-96 flex-col gap-2">
          <h1 className="text-xl font-semibold leading-tight tracking-tighter">
            Apply to our community
          </h1>
          <div className="mt-4 flex flex-col gap-2">
            <form
              className="space-y-4"
              onSubmit={handlePromise(form.handleSubmit(saveAccount))}
            >
              <div>
                <div className="pb-2">
                  <Label htmlFor="pullRequestUrl">Discord username</Label>
                </div>
                <Input
                  id="url"
                  {...form.register("discordUsername")}
                  placeholder="crocodilecoder360"
                />
                {form.formState.errors.discordUsername?.message && (
                  <p className="text-red-600">
                    {form.formState.errors.discordUsername?.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="pullRequestUrl">Pull Request</Label>
                <div className="pb-2 text-sm text-slate-500">
                  Share your best contribution to a 1k+ stars repo.
                </div>
                <Input
                  id="url"
                  {...form.register("pullRequestUrl")}
                  placeholder="https://github.com/owner/repo/pull/10509"
                />
                {form.formState.errors.pullRequestUrl?.message && (
                  <p className="pt-2 text-xs text-red-600">
                    {form.formState.errors.pullRequestUrl?.message}
                  </p>
                )}
              </div>
              <div className="pt-2">
                <Button
                  className="w-full"
                  type="submit"
                  disabled={mutation.isLoading || showConfetti}
                >
                  {mutation.isLoading && !showConfetti && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {showConfetti && <Check className="mr-2 h-4 w-4" />}
                  {!showConfetti && "Apply"}
                  {showConfetti && "Accepted"}
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <div className="text-sm text-slate-500">
                  Already have an account?
                </div>
                <Link href="/sign-in" className="text-sm hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
