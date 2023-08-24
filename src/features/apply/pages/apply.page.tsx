import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { toast } from "@/features/shared/components/ui/use-toast";
import { useZodForm } from "@/features/shared/hooks/use-zod-form";
import { handlePromise } from "@/features/shared/utils/utils";
import { api } from "@/server/lib/api";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { z } from "zod";

const formSchema = z.object({
  discordUsername: z.string(),
  pullRequestUrl: z.string().url(),
});

export default function ApplyPage() {
  const router = useRouter();
  const ctx = api.useContext();
  const mutation = api.account.create.useMutation({
    onSuccess: async () => {
      await ctx.account.invalidate();
      await router.push("/sign-up");
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast({
          variant: "destructive",
          description: errorMessage[0],
        });
      } else {
        toast({
          variant: "destructive",
          description: "Error! Please try again later.",
        });
      }
    },
  });

  const form = useZodForm({
    schema: formSchema,
  });

  function saveAccount(data: z.infer<typeof formSchema>) {
    return mutation.mutate({
      discordUsername: data.discordUsername,
      pullRequestUrl: data.pullRequestUrl,
    });
  }

  return (
    <>
      <div className="flex h-screen items-center justify-center px-4 sm:px-8 ">
        <div className="mt-6 flex max-w-[770px] flex-col items-center justify-center gap-2">
          <h1 className="text-xl font-semibold leading-tight tracking-tighter">
            Apply to our community
          </h1>
          <div className="mt-4 flex flex-col gap-2 text-center">
            <form
              className="w-96 space-y-4"
              onSubmit={handlePromise(form.handleSubmit(saveAccount))}
            >
              <div>
                <Label htmlFor="pullRequestUrl">Discord username</Label>
                <Input
                  id="url"
                  {...form.register("discordUsername")}
                  placeholder="user123"
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
                  placeholder="https://github.com/calcom/cal.com/pull/10509"
                />
                {form.formState.errors.pullRequestUrl?.message && (
                  <p className="text-red-600">
                    {form.formState.errors.pullRequestUrl?.message}
                  </p>
                )}
              </div>
              <div className="pt-2">
                <Button
                  className="w-full"
                  type="submit"
                  disabled={mutation.isLoading}
                >
                  {mutation.isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Apply
                </Button>
              </div>
              <div className="flex items-center justify-center gap-1">
                <div className="text-sm text-slate-500">
                  Already part of Monto?
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
