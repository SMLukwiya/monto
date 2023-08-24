import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/features/shared/components/ui/dropdown-menu";
import { toast } from "@/features/shared/components/ui/use-toast";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import { type MouseEvent, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/features/shared/components/ui/alert-dialog";
import { api } from "@/server/lib/api";

const ActionsDropdown = ({
  children,
  issueId,
}: {
  children: React.ReactNode;
  issueId: string;
}) => {
  const ctx = api.useContext();
  const router = useRouter();
  const deleteMutation = api.issue.delete.useMutation({
    onSuccess: async () => {
      toast({
        description: "Your issue has been deleted.",
      });

      await ctx.issue.list.invalidate();
      await router.push("/issues");
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
  const [isOpen, setIsOpen] = useState(false);

  const onDeleteConfirmed = (e: MouseEvent) => {
    e.stopPropagation();
    deleteMutation.mutate(issueId);
    ctx.issue.invalidate().catch(console.error);
    setIsOpen(false);
    void router.push("/issues");
  };

  const DeleteConfirmationDialog = () => {
    return (
      <AlertDialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this issue?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action is permanent and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteConfirmed}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return (
    <>
      <DeleteConfirmationDialog />
      <DropdownMenu>
        <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="text-red-400"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete issue
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export { ActionsDropdown };
